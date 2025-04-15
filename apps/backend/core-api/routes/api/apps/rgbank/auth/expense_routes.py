import json
import uuid
from typing import List
from datetime import timedelta
from flask import Blueprint, Response, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from http import HTTPStatus
from models.apps.rgbank import (
    AccountBankInformation,
    Expense,
    PaymentStatus,
    MessageType,
    Thread,
)
from models.core import Student, StudentMembership
from services.apps.rgbank import (
    add_committee_statistic,
    add_expense_count,
    add_student_statistic,
    has_access,
    has_full_authority,
    add_message,
)
from utility import db, upload_file, rgbank_bucket

expense_bp = Blueprint("expense", __name__)


@expense_bp.route("", methods=["POST"])
@jwt_required()
def create_expense() -> Response:
    """
    Creates a new expense
        :return: Response - The response object, 400 if no data is provided, 404 if the committee is not found, 201 if successful
    """
    if request.is_json:
        return jsonify({"message": "Invalid request format"}), HTTPStatus.BAD_REQUEST

    student_id = get_jwt_identity()

    form_data = request.form
    files = request.files.getlist("files")
    if not form_data and not files:
        return jsonify(
            {"message": f"No data provided, {form_data}, {files}"}
        ), HTTPStatus.BAD_REQUEST

    date = form_data.get("date")
    description = form_data.get("description")
    is_digital = form_data.get("is_digital", "false").lower() == "true"
    categories = form_data.get("categories")

    if not date or not categories or not files or not description:
        return jsonify(
            {
                "message": f"Missing required fields, {date}, {description}, {categories}, {files}"
            }
        ), HTTPStatus.BAD_REQUEST

    new_expense_id = uuid.uuid4()

    id_exists = Expense.query.filter_by(expense_id=new_expense_id).first()
    while id_exists:
        new_expense_id = uuid.uuid4()
        id_exists = Expense.query.filter_by(expense_id=new_expense_id).first()

    file_urls = []

    try:
        for file in files:
            # Ensure the file is a valid file type, either pdf or image
            if not file or not file.filename:
                continue

            file_extension = file.filename.split(".")[-1].lower()

            if file_extension not in [
                "pdf",
                "jpg",
                "jpeg",
                "png",
                "avif",
                "webp",
                "jfif",
                "pjpeg",
                "pjp",
            ]:
                return jsonify(
                    {"message": f"Invalid file type: {file_extension}"}
                ), HTTPStatus.BAD_REQUEST

            if file and file.filename:
                upload_result = upload_file(
                    file=file,
                    file_name=f"{new_expense_id}/{file.filename}",
                    path="expenses",
                    content_type="application/pdf"
                    if file_extension == "pdf"
                    else f"image/{file_extension}",
                    content_disposition="attachment",
                    bucket=rgbank_bucket,
                    timedelta=timedelta(days=90),
                )

                if not upload_result:
                    return jsonify(
                        {"message": "File upload failed"}
                    ), HTTPStatus.INTERNAL_SERVER_ERROR

                file_urls.append(upload_result)
    except Exception as e:
        return jsonify(
            {"message": f"Error uploading files: {str(e)}"}
        ), HTTPStatus.INTERNAL_SERVER_ERROR

    if not file_urls:
        return jsonify({"message": "No files uploaded"}), HTTPStatus.BAD_REQUEST

    new_expense = Expense(
        expense_id=new_expense_id,
        file_urls=file_urls,
        description=description,
        date=date,
        is_digital=is_digital,
        categories=json.loads(categories),
        status="UNCONFIRMED",
        student_id=student_id,
    )

    db.session.add(new_expense)
    db.session.commit()

    return jsonify({"message": "Expense created successfully"}), HTTPStatus.CREATED


@expense_bp.route("/<string:expense_id>", methods=["GET"])
@jwt_required()
def get_expense(expense_id: str) -> Response:
    """Gets an expense by ID

    :param expense_id: The ID of the expense to get
    :type expense_id: str
    :return: The response object, 404 if the expense is not found, 200 if successful
    :rtype: Response
    """
    expense: Expense = Expense.query.filter_by(expense_id=expense_id).first_or_404()

    student_id = get_jwt_identity()
    memberships: List[StudentMembership] = StudentMembership.query.filter(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    ).all()

    is_authorized, message = has_access(
        cost_item=expense,
        student_id=student_id,
        memberships=memberships,
    )

    if not is_authorized:
        return jsonify({"error": message}), HTTPStatus.UNAUTHORIZED

    student: Student = Student.query.filter_by(student_id=student_id).first()
    if not student or not isinstance(student, Student):
        return jsonify({"error": "Student not found"}), HTTPStatus.NOT_FOUND

    bank_information = AccountBankInformation.query.filter_by(
        student_id=student.student_id
    ).first()

    if not bank_information or not isinstance(bank_information, AccountBankInformation):
        return jsonify({"error": "Bank information not found"}), HTTPStatus.NOT_FOUND

    thread: Thread = Thread.query.filter_by(
        expense_id=expense_id,
    ).first()

    return jsonify(
        {
            "expense": expense.to_dict(),
            "student": student.to_dict(),
            "bank_information": bank_information.to_dict(),
            "thread": thread.to_dict() if thread else None,
        }
    ), HTTPStatus.OK


@expense_bp.route("/student/<string:student_id>", methods=["GET"])
@jwt_required()
def get_expenses_by_student(student_id: str) -> Response:
    """Gets all expenses by student ID

    :param student_id: The ID of the student to get expenses for
    :type student_id: str
    :return: The response object, 404 if the student is not found, 200 if successful
    :rtype: Response
    """
    request_student_id = get_jwt_identity()
    if student_id != request_student_id:
        return jsonify(
            {"error": "You are not authorized to view this student's expenses"}
        ), HTTPStatus.UNAUTHORIZED

    expenses: List[Expense] = Expense.query.filter_by(student_id=student_id).all()

    if not expenses:
        return jsonify([]), HTTPStatus.NOT_FOUND

    return jsonify([expense.to_dict() for expense in expenses]), HTTPStatus.OK


@expense_bp.route("/<string:expense_id>", methods=["PUT"])
@jwt_required()
def update_expense(expense_id: str) -> Response:
    """Updates an expense by ID, updates everything except the file urls

    :param expense_id: The ID of the expense to update
    :type expense_id: str
    :return: The response object, 400 if no data is provided, 404 if the expense is not found, 200 if successful
    :rtype: Response
    """

    expense: Expense = Expense.query.filter_by(expense_id=expense_id).first_or_404()

    student_id = get_jwt_identity()

    if expense.student_id != student_id:
        return jsonify(
            {"error": "You are not authorized to update this expense"}
        ), HTTPStatus.UNAUTHORIZED

    data = request.get_json()
    if not data:
        return jsonify({"message": "No data provided"}), HTTPStatus.BAD_REQUEST

    for key, value in data.items():
        if key == "files":
            continue
        if key == "status":
            continue
        setattr(expense, key, value)

    db.session.commit()

    return jsonify({"message": "Expense updated successfully"}), HTTPStatus.OK


@expense_bp.route("/<string:expense_id>/status", methods=["PATCH"])
@jwt_required()
def update_expense_status(expense_id: str) -> Response:
    """Updates an expense by ID, updates everything except the file urls

    :param expense_id: The ID of the expense to update
    :type expense_id: str
    :return: The response object, 400 if no data is provided, 404 if the expense is not found, 200 if successful
    :rtype: Response
    """

    expense: Expense = Expense.query.filter_by(expense_id=expense_id).first_or_404()

    student_id = get_jwt_identity()

    memberships: List[StudentMembership] = StudentMembership.query.filter(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    ).all()

    has_authority, message = has_full_authority(
        memberships=memberships,
    )

    if not has_authority:
        return jsonify({"error": message}), HTTPStatus.UNAUTHORIZED

    data = request.get_json()
    if not data:
        return jsonify({"message": "No data provided"}), HTTPStatus.BAD_REQUEST

    status = data.get("status")
    if not status:
        return jsonify({"message": "Status is required"}), HTTPStatus.BAD_REQUEST

    expense_status = PaymentStatus[expense.status.name]
    new_status = PaymentStatus[status.upper()]

    if new_status < expense_status:
        return jsonify(
            {
                "error": f"You cannot change the status to a lower status, {expense_status.value} -> {new_status.value}"
            }
        ), HTTPStatus.BAD_REQUEST

    comment = data.get("comment")
    previous_status = expense.status
    thread = Thread.query.filter_by(
        expense_id=expense_id,
    ).first()

    thread_id = thread.thread_id if thread else None

    try:
        add_message(
            thread_id=thread_id,
            sender_id=None,
            message_text=f"status_changed_{status.lower()}" if not comment else comment,
            type=MessageType.SYSTEM,
            create_thread_if_not_exists=True,
            expense_id=expense_id,
            previous_status=previous_status,
            new_status=new_status,
        )
    except ValueError as e:
        return jsonify({"message": str(e)}), HTTPStatus.BAD_REQUEST

    if new_status == PaymentStatus.BOOKED:
        add_student_statistic(student_id=expense.student_id, value=expense.amount)
        add_committee_statistic(
            committee_id=expense.committee.committee_id,
            value=expense.amount,
        )
        add_expense_count(
            student_id=expense.student_id,
            committee_id=expense.committee.committee_id,
            expense_count=1,
        )

    expense.status = status
    db.session.commit()

    return jsonify({"message": "Expense status updated successfully"}), HTTPStatus.OK


@expense_bp.route("/<string:expense_id>", methods=["DELETE"])
@jwt_required()
def delete_expense(expense_id: str) -> Response:
    """Deletes an expense by ID

    :param expense_id: The ID of the expense to delete
    :type expense_id: str
    :return: The response object, 404 if the expense is not found, 200 if successful
    :rtype: Response
    """

    expense: Expense = Expense.query.filter_by(expense_id=expense_id).first_or_404()

    if (
        expense.status != PaymentStatus.UNCONFIRMED
        and expense.status != PaymentStatus.REJECTED
    ):
        return jsonify(
            {
                "error": "You cannot delete an expense that is already confirmed or rejected"
            }
        ), HTTPStatus.BAD_REQUEST

    student_id = get_jwt_identity()

    if expense.student_id != student_id:
        return jsonify(
            {"error": "You are not authorized to delete this expense"}
        ), HTTPStatus.UNAUTHORIZED

    db.session.delete(expense)
    db.session.commit()

    return jsonify({"message": "Expense deleted successfully"}), HTTPStatus.OK


@expense_bp.route("/<string:expense_id>/messages", methods=["POST"])
@jwt_required()
def add_expense_message(expense_id: str) -> Response:
    """Sends a message to the committee for an expense by ID

    :param expense_id: The ID of the expense to send a message for
    :type expense_id: str
    :return: The response object, 404 if the expense is not found, 200 if successful
    :rtype: Response
    """
    expense: Expense = Expense.query.filter_by(expense_id=expense_id).first_or_404()

    if (
        expense.status == PaymentStatus.CONFIRMED
        or expense.status == PaymentStatus.REJECTED
        or expense.status == PaymentStatus.PAID
        or expense.status == PaymentStatus.BOOKED
    ):
        return jsonify(
            {
                "error": "You cannot send a message for an expense that is not unconfirmed or requires clarification"
            }
        ), HTTPStatus.BAD_REQUEST

    student_id = get_jwt_identity()
    memberships: List[StudentMembership] = StudentMembership.query.filter(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    ).all()

    is_authorized, message = has_access(
        cost_item=expense,
        student_id=student_id,
        memberships=memberships,
    )

    if not is_authorized:
        return jsonify({"error": message}), HTTPStatus.UNAUTHORIZED

    data = request.get_json()
    if not data:
        return jsonify({"message": "No data provided"}), HTTPStatus.BAD_REQUEST

    message_text = data.get("message")
    if not message_text:
        return jsonify({"message": "Content is required"}), HTTPStatus.BAD_REQUEST

    thread = Thread.query.filter_by(
        expense_id=expense_id,
    ).first()
    thread_id = thread.thread_id if thread else None

    try:
        add_message(
            thread_id=thread_id,
            sender_id=str(student_id),
            message_text=str(message_text),
            create_thread_if_not_exists=True,
            expense_id=expense_id,
        )
    except ValueError as e:
        return jsonify({"message": str(e)}), HTTPStatus.BAD_REQUEST

    return jsonify({"message": "Message sent successfully"}), HTTPStatus.CREATED
