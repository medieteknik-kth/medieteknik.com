import json
import uuid
from datetime import timedelta
from http import HTTPStatus
from typing import Annotated, Any, Dict, List

from fastapi import APIRouter, Depends, Form, HTTPException, Path, Request, Response
from google.cloud.exceptions import GoogleCloudError
from sqlmodel import select

from config import Settings
from decorators.jwt import get_jwt_identity, jwt_required
from dto.apps.rgbank.expense import (
    CreateExpenseForm,
    ExpenseDTO,
    ExpenseResponseDTO,
    UpdateItemForm,
)
from dto.apps.rgbank.thread import AddMessageDTO
from models.apps.rgbank import (
    AccountBankInformation,
    Expense,
    MessageType,
    PaymentStatus,
    Thread,
)
from models.core import Student, StudentMembership
from routes.api.deps import SessionDep
from services.apps.rgbank import (
    add_committee_statistic,
    add_expense_count,
    add_message,
    add_student_statistic,
    has_access,
    has_full_authority,
    retrieve_accessible_cost_items,
)
from services.utility.mail import send_expense_message
from utility import rgbank_bucket, upload_file
from utility.parser import parse_body, validate_form_to_msgspec

router = APIRouter(
    prefix=Settings.API_ROUTE_PREFIX + "/rgbank/expenses",
    tags=["RGBank", "Expenses"],
)


@router.post(
    "/",
    status_code=HTTPStatus.CREATED,
    responses={
        HTTPStatus.CREATED: {"description": "Expense created successfully"},
        HTTPStatus.BAD_REQUEST: {"description": "Invalid request data"},
        HTTPStatus.UNAUTHORIZED: {"description": "Unauthorized"},
        HTTPStatus.NOT_FOUND: {"description": "Committee not found"},
        HTTPStatus.INTERNAL_SERVER_ERROR: {"description": "Unable to upload file"},
        HTTPStatus.UNPROCESSABLE_ENTITY: {
            "description": "Invalid request data",
        },
    },
)
async def create_expense(
    session: SessionDep,
    files: Annotated[list[bytes], Form()],
    date: Annotated[str, Form()],
    title: Annotated[str, Form()],
    description: Annotated[str, Form()],
    is_digital: Annotated[str, Form()],
    categories: Annotated[list[Dict[str, Any]], Form()],
    jwt: Dict[str, Any] = Depends(jwt_required),
):
    """
    Creates a new expense
        :return: Response - The response object, 400 if no data is provided, 404 if the committee is not found, 201 if successful
    """
    form_data = {
        "files": files,
        "date": date,
        "title": title,
        "description": description,
        "is_digital": is_digital,
        "categories": categories,
    }

    validated_data = validate_form_to_msgspec(
        form_data=form_data,
        model_type=CreateExpenseForm,
    )

    student_id = get_jwt_identity(jwt)

    new_expense_id = uuid.uuid4()

    id_exists = session.exec(
        select(Expense).where(Expense.expense_id == new_expense_id)
    ).first()
    while id_exists:
        new_expense_id = uuid.uuid4()
        id_exists = session.exec(
            select(Expense).where(Expense.expense_id == new_expense_id)
        ).first()

    file_urls = []

    for file in validated_data.files:
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
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail="Invalid file type. Only PDF and image files are allowed.",
            )

        if file and file.filename:
            try:
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
                    raise HTTPException(
                        status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                        detail="Error uploading file",
                    )
            except GoogleCloudError as e:
                raise HTTPException(
                    status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                    detail=f"Error uploading file: {str(e)}",
                )

            file_urls.append(upload_result)

    if not file_urls:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="No files provided",
        )

    new_expense = Expense(
        expense_id=new_expense_id,
        file_urls=file_urls,
        title=validated_data.title,
        description=validated_data.description,
        date=validated_data.date,
        is_digital=validated_data.is_digital,
        categories=json.loads(validated_data.categories),
        status="UNCONFIRMED",
        student_id=student_id,
    )

    session.add(new_expense)
    session.commit()
    session.refresh(new_expense)

    new_thread = session.exec(
        select(Thread).where(Thread.expense_id == new_expense_id)
    ).first()

    session.add(new_thread)
    session.commit()
    session.refresh(new_thread)

    send_expense_message(
        expense_item=new_expense,
        subject="Ny utgift har skapats",
    )

    return Response(status_code=HTTPStatus.CREATED)


@router.get(
    "/all",
    response_model=list[ExpenseDTO],
    responses={
        HTTPStatus.OK: {"description": "Expenses retrieved successfully"},
        HTTPStatus.NOT_FOUND: {"description": "No expenses found"},
        HTTPStatus.UNAUTHORIZED: {"description": "Unauthorized"},
    },
)
async def all_expenses(
    session: SessionDep,
    jwt: Dict[str, Any] = Depends(jwt_required),
):
    """Gets all invoices

    :return: The response object, 200 if successful
    :rtype: Response
    """
    student_id = get_jwt_identity(jwt)

    stmt = select(StudentMembership).where(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    )

    memberships = session.exec(stmt).all()

    expenses: List[Expense] | None = retrieve_accessible_cost_items(
        session=session,
        cost_item=Expense,
        memberships=memberships,
    )

    if not expenses:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="No expenses found",
        )

    return [expense for expense in expenses]


@router.get(
    "/{expense_id}",
    response_model=ExpenseResponseDTO,
)
async def get_expense(
    session: SessionDep,
    expense_id: Annotated[str, Path(title="The ID of the expense")],
    jwt: Dict[str, Any] = Depends(jwt_required),
) -> Response:
    """Gets an expense by ID

    :param expense_id: The ID of the expense to get
    :type expense_id: str
    :return: The response object, 404 if the expense is not found, 200 if successful
    :rtype: Response
    """
    expense = session.exec(select(Expense).where(Expense.expense_id == expense_id))

    student_id = get_jwt_identity(jwt)

    stmt = select(StudentMembership).where(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    )
    memberships = session.exec(stmt).all()

    is_authorized, message = has_access(
        session=session,
        cost_item=expense,
        student_id=student_id,
        memberships=memberships,
    )

    if not is_authorized:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail=message,
        )

    student = session.exec(
        select(Student).where(Student.student_id == student_id)
    ).first()

    if not student:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Student not found",
        )

    bank_information = session.exec(
        select(AccountBankInformation).where(
            AccountBankInformation.student_id == student_id
        )
    ).first()

    thread = session.exec(select(Thread).where(Thread.expense_id == expense_id)).first()

    base_dict = {
        "expense": expense,
        "student": student,
        "bank_information": bank_information,
    }

    if thread:
        base_dict["thread"] = thread

    return base_dict


@router.get(
    "/student/{student_id}",
    response_model=list[ExpenseDTO],
    responses={
        HTTPStatus.OK: {"description": "Expenses retrieved successfully"},
        HTTPStatus.NOT_FOUND: {"description": "No expenses found"},
        HTTPStatus.UNAUTHORIZED: {"description": "Unauthorized"},
    },
)
async def get_expenses_by_student(
    session: SessionDep,
    student_id: Annotated[str, Path(title="The ID of the student")],
    jwt: Dict[str, Any] = Depends(jwt_required),
) -> Response:
    request_student_id = get_jwt_identity(jwt)

    if student_id != request_student_id:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="You are not authorized to view this student's expenses",
        )

    stmt = (
        select(Expense)
        .where(
            Expense.student_id == student_id,
        )
        .order_by(Expense.created_at.desc())
    )

    expenses = session.exec(stmt).all()

    if not expenses:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="No expenses found for this student",
        )

    return [expense for expense in expenses]


@router.patch(
    "/{expense_id}/status",
    status_code=HTTPStatus.OK,
    responses={
        HTTPStatus.OK: {"description": "Expense status updated successfully"},
        HTTPStatus.NOT_FOUND: {"description": "Expense not found"},
        HTTPStatus.UNAUTHORIZED: {"description": "Unauthorized"},
        HTTPStatus.BAD_REQUEST: {"description": "Bad request"},
    },
)
async def update_expense_status(
    session: SessionDep,
    request: Request,
    expense_id: Annotated[str, Path(title="The ID of the expense")],
    jwt: Dict[str, Any] = Depends(jwt_required),
):
    validated_data = await parse_body(
        request=request,
        model_type=UpdateItemForm,
    )

    expense = session.exec(
        select(Expense).where(Expense.expense_id == expense_id)
    ).first()

    if not expense:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Expense not found",
        )

    student_id = get_jwt_identity(jwt)

    stmt = select(StudentMembership).where(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    )

    memberships = session.exec(stmt).all()

    has_authority, message = has_full_authority(
        session=session,
        memberships=memberships,
    )

    if not has_authority:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail=message,
        )

    status = validated_data.status
    if not status:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="Status is required",
        )

    expense_status = PaymentStatus[expense.status.name]
    new_status = PaymentStatus[status.upper()]

    if new_status < expense_status:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="You cannot change the status to a lower status",
        )

    previous_status = expense.status
    thread = session.exec(select(Thread).where(Thread.expense_id == expense_id)).first()

    thread_id = thread.thread_id if thread else None

    try:
        add_message(
            thread_id=thread_id,
            sender_id=None,
            message_text=f"status_changed_{status.lower()}"
            if not validated_data.comment
            else validated_data.comment,
            type=MessageType.SYSTEM,
            create_thread_if_not_exists=True,
            expense_id=expense_id,
            previous_status=previous_status,
            new_status=new_status,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=str(e),
        )

    if new_status == PaymentStatus.BOOKED:
        add_student_statistic(student_id=expense.student_id, value=expense.amount)

        if expense.committee:
            add_committee_statistic(
                committee_id=expense.committee.committee_id,
                value=expense.amount,
            )

        add_expense_count(
            student_id=expense.student_id,
            committee_id=expense.committee.committee_id if expense.committee else None,
            expense_count=1,
        )

    expense.status = status
    session.commit()

    return Response(
        status_code=HTTPStatus.OK,
        content={
            "message": "Expense status updated successfully",
            "status": status,
        },
    )


@router.patch(
    "/{expense_id}/categories",
    status_code=HTTPStatus.OK,
    responses={
        HTTPStatus.OK: {"description": "Expense categories updated successfully"},
        HTTPStatus.NOT_FOUND: {"description": "Expense not found"},
        HTTPStatus.UNAUTHORIZED: {"description": "Unauthorized"},
        HTTPStatus.BAD_REQUEST: {"description": "Bad request"},
    },
)
async def update_expense_categories(
    session: SessionDep,
    request: Request,
    expense_id: Annotated[str, Path(title="The ID of the expense")],
    jwt: Dict[str, Any] = Depends(jwt_required),
):
    validated_data = await parse_body(
        request=request,
        model_type=UpdateItemForm,
    )

    expense = session.exec(
        select(Expense).where(Expense.expense_id == expense_id)
    ).first()

    if not expense:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Expense not found",
        )

    student_id = get_jwt_identity(jwt)

    stmt = select(StudentMembership).where(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    )
    memberships = session.exec(stmt).all()

    has_authority, message = has_full_authority(
        session=session,
        memberships=memberships,
    )

    if not has_authority:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail=message,
        )

    new_categories = validated_data.updatedCategories
    if not new_categories:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="Categories are required",
        )

    expense.categories = new_categories
    session.commit()

    return Response(
        status_code=HTTPStatus.OK,
        content={
            "message": "Expense categories updated successfully",
            "categories": new_categories,
        },
    )


@router.delete(
    "/{expense_id}",
    status_code=HTTPStatus.OK,
    responses={
        HTTPStatus.OK: {"description": "Expense deleted successfully"},
        HTTPStatus.NOT_FOUND: {"description": "Expense not found"},
        HTTPStatus.UNAUTHORIZED: {"description": "Unauthorized"},
        HTTPStatus.BAD_REQUEST: {"description": "Bad request"},
    },
)
async def delete_expense(
    session: SessionDep,
    expense_id: Annotated[str, Path(title="The ID of the expense")],
    jwt: Dict[str, Any] = Depends(jwt_required),
) -> Response:
    """Deletes an expense by ID

    :param expense_id: The ID of the expense to delete
    :type expense_id: str
    :return: The response object, 404 if the expense is not found, 200 if successful
    :rtype: Response
    """

    expense = session.exec(
        select(Expense).where(Expense.expense_id == expense_id)
    ).first()

    if not expense:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Expense not found",
        )

    student_id = get_jwt_identity(jwt)

    if str(expense.student_id) != str(student_id):
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="You are not authorized to delete this expense",
        )

    if expense.status != PaymentStatus.UNCONFIRMED:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="You cannot delete an expense that is not unconfirmed",
        )

    session.delete(expense)
    session.commit()

    return Response(
        status_code=HTTPStatus.OK,
        content={
            "message": "Expense deleted successfully",
        },
    )


@router.post(
    "/{expense_id}/messages",
    status_code=HTTPStatus.OK,
    responses={
        HTTPStatus.OK: {"description": "Message sent successfully"},
        HTTPStatus.NOT_FOUND: {"description": "Expense not found"},
        HTTPStatus.UNAUTHORIZED: {"description": "Unauthorized"},
        HTTPStatus.BAD_REQUEST: {"description": "Bad request"},
    },
)
async def add_expense_message(
    session: SessionDep,
    request: Request,
    expense_id: Annotated[str, Path(title="The ID of the expense")],
    jwt: Dict[str, Any] = Depends(jwt_required),
):
    validated_data = parse_body(
        request=request,
        model_type=AddMessageDTO,
    )

    expense = session.exec(
        select(Expense).where(Expense.expense_id == expense_id)
    ).first()

    if not expense:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Expense not found",
        )

    if (
        expense.status == PaymentStatus.CONFIRMED
        or expense.status == PaymentStatus.REJECTED
        or expense.status == PaymentStatus.PAID
        or expense.status == PaymentStatus.BOOKED
    ):
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="You cannot send a message for an expense that is not unconfirmed",
        )

    student_id = get_jwt_identity(jwt)

    stmt = select(StudentMembership).where(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    )
    memberships = session.exec(stmt).all()

    is_authorized, message = has_access(
        session=session,
        cost_item=expense,
        student_id=student_id,
        memberships=memberships,
    )

    if not is_authorized:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail=message,
        )

    thread = session.exec(select(Thread).where(Thread.expense_id == expense_id)).first()
    thread_id = thread.thread_id if thread else None

    try:
        add_message(
            thread_id=thread_id,
            sender_id=str(student_id),
            message_text=str(validated_data.message),
            create_thread_if_not_exists=True,
            expense_id=expense_id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=str(e),
        )

    return Response(
        status_code=HTTPStatus.OK,
        content={
            "message": "Message sent successfully",
        },
    )
