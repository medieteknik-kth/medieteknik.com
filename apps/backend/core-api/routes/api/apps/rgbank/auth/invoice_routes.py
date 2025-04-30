import json
import uuid
from datetime import timedelta
from typing import List
from flask import Blueprint, Response, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from http import HTTPStatus
from models.apps.rgbank import (
    AccountBankInformation,
    Invoice,
    PaymentStatus,
    MessageType,
    Thread,
)
from models.core import Student, StudentMembership
from services.apps.rgbank import (
    add_committee_statistic,
    add_expense_count,
    add_student_statistic,
    retrieve_accessible_cost_items,
    has_access,
    has_full_authority,
    add_message,
)
from utility import db, upload_file, rgbank_bucket

invoice_bp = Blueprint("invoice", __name__)


@invoice_bp.route("", methods=["POST"])
@jwt_required()
def create_invoice() -> Response:
    """Creates a new invoice

    :return: The response object, 400 if no data is provided, 404 if the committee is not found, 201 if successful
    :rtype: Response
    """
    if request.is_json:
        return jsonify({"message": "Invalid request format"}), HTTPStatus.BAD_REQUEST

    student_id = get_jwt_identity()

    form_data = request.form
    files = request.files.getlist("files")
    if not form_data and not files:
        return jsonify({"message": "No data provided"}), HTTPStatus.BAD_REQUEST

    already_paid = form_data.get("already_paid", "false").lower() == "true"
    description = form_data.get("description")
    is_original = form_data.get("is_original", "false").lower() == "true"
    is_booked = form_data.get("is_booked", "false").lower() == "true"
    date_issued = form_data.get("date_issued")
    due_date = form_data.get("due_date")
    categories = form_data.get("categories")

    if not date_issued or not due_date or not categories or not description:
        return jsonify(
            {
                "message": f"Missing required fields, {date_issued}, {due_date}, {categories}, {description}"
            }
        ), HTTPStatus.BAD_REQUEST

    new_invoice_id = uuid.uuid4()

    id_exists = Invoice.query.filter_by(invoice_id=new_invoice_id).first()
    while id_exists:
        new_invoice_id = uuid.uuid4()
        id_exists = Invoice.query.filter_by(invoice_id=new_invoice_id).first()

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

            upload_result = upload_file(
                file=file,
                file_name=f"{new_invoice_id}/{file.filename}",
                path="invoices",
                content_type="application/pdf"
                if file_extension == "pdf"
                else f"image/{file_extension}",
                content_disposition="attachment",
                bucket=rgbank_bucket,
                timedelta=timedelta(days=90),
            )

            if not upload_result:
                return jsonify(
                    {"message": "Error uploading file"}
                ), HTTPStatus.BAD_REQUEST

            file_urls.append(upload_result)

    except Exception as e:
        return jsonify(
            {"message": f"Error uploading files: {str(e)}"}
        ), HTTPStatus.BAD_REQUEST

    if not file_urls:
        return jsonify({"message": "No files uploaded"}), HTTPStatus.BAD_REQUEST

    invoice = Invoice(
        invoice_id=new_invoice_id,
        already_paid=already_paid,
        file_urls=file_urls,
        description=description,
        is_original=is_original,
        is_booked=is_booked,
        date_issued=date_issued,
        due_date=due_date,
        categories=json.loads(categories),
        status=PaymentStatus.UNCONFIRMED,
        student_id=student_id,
    )

    db.session.add(invoice)
    db.session.commit()

    return jsonify({"message": "Invoice created successfully"}), HTTPStatus.CREATED


@invoice_bp.route("/all", methods=["GET"])
@jwt_required()
def all_invoices():
    """Gets all invoices

    :return: The response object, 200 if successful
    :rtype: Response
    """
    student_id = get_jwt_identity()
    memberships: List[StudentMembership] = StudentMembership.query.filter(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    ).all()
    page = request.args.get("page", 1, type=int)

    invoices: List[Invoice] = retrieve_accessible_cost_items(
        cost_item=Invoice,
        memberships=memberships,
        page=page,
    )

    if not invoices:
        return jsonify([]), HTTPStatus.NOT_FOUND

    return jsonify(
        [
            invoice.to_dict(
                short=True,
                is_public_route=False,
            )
            for invoice in invoices
        ]
    ), HTTPStatus.OK


@invoice_bp.route("/<string:invoice_id>", methods=["GET"])
@jwt_required()
def get_invoice(invoice_id: str) -> Response:
    """Gets and invoice by ID

    :param invoice_id: The ID of the invoice to get
    :type invoice_id: str
    :return: The response object, 404 if the invoice is not found, 200 if successful
    :rtype: Response
    """
    invoice = Invoice.query.filter_by(invoice_id=invoice_id).first_or_404()

    student_id = get_jwt_identity()
    memberships: List[StudentMembership] = StudentMembership.query.filter(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    ).all()

    is_authorized, message = has_access(
        cost_item=invoice,
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
        invoice_id=invoice.invoice_id,
    ).first()

    return jsonify(
        {
            "invoice": invoice.to_dict(),
            "student": student.to_dict(is_public_route=False),
            "bank_information": bank_information.to_dict(),
            "thread": thread.to_dict(include_messages=True) if thread else None,
        }
    ), HTTPStatus.OK


@invoice_bp.route("/student/<string:student_id>", methods=["GET"])
@jwt_required()
def get_invoices_by_student(student_id: str) -> Response:
    """Gets all invoices by student ID

    :param student_id: The ID of the student to get invoices for
    :type student_id: str
    :return: The response object, 404 if the student is not found, 200 if successful
    :rtype: Response
    """
    request_student_id = get_jwt_identity()
    if student_id != request_student_id:
        return jsonify(
            {"error": "You are not authorized to view this student's invoices"}
        ), HTTPStatus.UNAUTHORIZED

    invoices: List[Invoice] = (
        Invoice.query.filter_by(student_id=student_id)
        .order_by(Invoice.created_at.desc())
        .all()
    )

    if not invoices:
        return jsonify([]), HTTPStatus.NOT_FOUND

    return jsonify([invoice.to_dict() for invoice in invoices]), HTTPStatus.OK


@invoice_bp.route("/<string:invoice_id>", methods=["PUT"])
@jwt_required()
def update_invoice(invoice_id: str) -> Response:
    """Updates an invoice by ID

    :param invoice_id: The ID of the invoice to update
    :type invoice_id: str
    :return: The response object, 400 if no data is provided, 404 if the invoice is not found, 200 if successful
    :rtype: Response
    """
    invoice = Invoice.query.filter_by(invoice_id=invoice_id).first_or_404()

    student_id = get_jwt_identity()

    if invoice.student_id != student_id:
        return jsonify(
            {"error": "You are not authorized to update this invoice"}
        ), HTTPStatus.UNAUTHORIZED

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), HTTPStatus.BAD_REQUEST

    for key, value in data.items():
        if key == "files":
            continue
        if key == "status":
            continue
        setattr(invoice, key, value)

    db.session.commit()

    return jsonify({"message": "Invoice updated successfully"}), HTTPStatus.OK


@invoice_bp.route("/<string:invoice_id>/status", methods=["PATCH"])
@jwt_required()
def update_invoice_status(invoice_id: str) -> Response:
    """Updates the status of an invoice by ID

    :param invoice_id: The ID of the invoice to update
    :type invoice_id: str
    :return: The response object, 400 if no data is provided, 404 if the invoice is not found, 200 if successful
    :rtype: Response
    """
    invoice: Invoice = Invoice.query.filter_by(invoice_id=invoice_id).first_or_404()

    student_id = get_jwt_identity()
    memberships = StudentMembership.query.filter(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    ).all()

    has_authority = has_full_authority(memberships=memberships)
    if not has_authority:
        return jsonify(
            {"error": "You are not authorized to update this invoice"}
        ), HTTPStatus.UNAUTHORIZED

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), HTTPStatus.BAD_REQUEST

    status: str = data.get("status")
    if not status:
        return jsonify({"error": "Status is required"}), HTTPStatus.BAD_REQUEST

    invoice_status = PaymentStatus[invoice.status.name]
    new_status = PaymentStatus[status.upper()]

    if new_status < invoice_status:
        return jsonify(
            {
                "error": f"You cannot change the status to a lower status, {invoice_status.value} -> {new_status.value}"
            }
        ), HTTPStatus.BAD_REQUEST

    comment = data.get("comment")
    previous_status = invoice.status
    thread = Thread.query.filter_by(
        invoice_id=invoice_id,
    ).first()

    thread_id = thread.thread_id if thread else None

    try:
        add_message(
            thread_id=thread_id,
            sender_id=None,
            message_text=f"status_changed_{status.lower()}" if not comment else comment,
            type=MessageType.SYSTEM,
            create_thread_if_not_exists=True,
            invoice_id=invoice_id,
            previous_status=previous_status,
            new_status=new_status,
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), HTTPStatus.BAD_REQUEST

    if new_status == PaymentStatus.BOOKED:
        add_student_statistic(student_id=invoice.student_id, value=invoice.amount)
        if invoice.committee:
            add_committee_statistic(
                committee_id=invoice.committee.committee_id,
                value=invoice.amount,
            )

        add_expense_count(
            student_id=invoice.student_id,
            committee_id=invoice.committee.committee_id if invoice.committee else None,
            invoice_count=1,
        )

    invoice.status = status
    db.session.commit()

    return jsonify({"message": "Invoice status updated successfully"}), HTTPStatus.OK


@invoice_bp.route("/<string:invoice_id>", methods=["DELETE"])
@jwt_required()
def delete_invoice(invoice_id: str) -> Response:
    """Deletes an invoice by ID

    :param invoice_id: The ID of the invoice to delete
    :type invoice_id: str
    :return: The response object, 404 if the invoice is not found, 200 if successful
    :rtype: Response
    """
    invoice = Invoice.query.filter_by(invoice_id=invoice_id).first_or_404()

    if (
        invoice.status != PaymentStatus.UNCONFIRMED
        and invoice.status != PaymentStatus.REJECTED
    ):
        return jsonify(
            {
                "error": "You cannot delete an invoice that is already confirmed or rejected"
            }
        ), HTTPStatus.BAD_REQUEST

    student_id = get_jwt_identity()
    if invoice.student_id != student_id:
        return jsonify(
            {"error": "You are not authorized to delete this invoice"}
        ), HTTPStatus.UNAUTHORIZED

    db.session.delete(invoice)
    db.session.commit()

    return jsonify({"message": "Invoice deleted successfully"}), HTTPStatus.OK


@invoice_bp.route("/<string:invoice_id>/messages", methods=["POST"])
@jwt_required()
def add_invoice_message(invoice_id: str) -> Response:
    """Adds a message to an invoice by ID

    :param invoice_id: The ID of the invoice to add a message to
    :type invoice_id: str
    :return: The response object, 400 if no data is provided, 404 if the invoice is not found, 200 if successful
    :rtype: Response
    """
    invoice: Invoice = Invoice.query.filter_by(invoice_id=invoice_id).first_or_404()

    if (
        invoice.status == PaymentStatus.CONFIRMED
        or invoice.status == PaymentStatus.REJECTED
        or invoice.status == PaymentStatus.PAID
        or invoice.status == PaymentStatus.BOOKED
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
        cost_item=invoice,
        student_id=student_id,
        memberships=memberships,
    )

    if not is_authorized:
        return jsonify({"error": message}), HTTPStatus.UNAUTHORIZED

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), HTTPStatus.BAD_REQUEST

    message_text = data.get("message")
    if not message_text:
        return jsonify({"error": "Message is required"}), HTTPStatus.BAD_REQUEST

    thread: Thread | None = Thread.query.filter_by(
        invoice_id=invoice.invoice_id,
    ).first()
    thread_id = thread.thread_id if thread else None

    try:
        add_message(
            thread_id=thread_id,
            sender_id=str(student_id),
            message_text=str(message_text),
            create_thread_if_not_exists=True,
            invoice_id=invoice_id,
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), HTTPStatus.BAD_REQUEST

    return jsonify({"message": "Message added successfully"}), HTTPStatus.CREATED
