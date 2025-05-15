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
    CreateInvoiceForm,
    InvoiceDTO,
    InvoiceResponseDTO,
    UpdateItemForm,
)
from dto.apps.rgbank.thread import AddMessageDTO
from models.apps.rgbank import (
    AccountBankInformation,
    Invoice,
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
    prefix=Settings.API_ROUTE_PREFIX + "/rgbank/invoices",
    tags=["RGBank", "Invoices"],
)


@router.post(
    "/",
    responses={
        HTTPStatus.CREATED: {
            "description": "Invoice created successfully",
        },
        HTTPStatus.BAD_REQUEST: {
            "description": "Invalid file type or no files provided",
        },
        HTTPStatus.INTERNAL_SERVER_ERROR: {
            "description": "Failed to upload file",
        },
        HTTPStatus.UNAUTHORIZED: {
            "description": "Unauthorized",
        },
    },
)
async def create_invoice(
    session: SessionDep,
    files: Annotated[list[bytes], Form()],
    already_paid: Annotated[bool, Form()],
    title: Annotated[str, Form()],
    description: Annotated[str, Form()],
    is_original: Annotated[bool, Form()],
    is_booked: Annotated[bool, Form()],
    date_issued: Annotated[str, Form()],
    due_date: Annotated[str, Form()],
    categories: Annotated[list[Dict[str, Any]], Form()],
    jwt: Dict[str, Any] = Depends(jwt_required),
):
    """Creates a new invoice

    :return: The response object, 400 if no data is provided, 404 if the committee is not found, 201 if successful
    :rtype: Response
    """
    form_data = {
        "files": files,
        "already_paid": already_paid,
        "title": title,
        "description": description,
        "is_original": is_original,
        "is_booked": is_booked,
        "date_issued": date_issued,
        "due_date": due_date,
        "categories": categories,
    }

    validated_data = validate_form_to_msgspec(
        form_data=form_data,
        model_type=CreateInvoiceForm,
    )

    student_id = get_jwt_identity(jwt)

    new_invoice_id = uuid.uuid4()

    id_exists = session.exec(
        select(Invoice).where(Invoice.invoice_id == new_invoice_id)
    ).first()
    while id_exists:
        new_invoice_id = uuid.uuid4()
        id_exists = session.exec(
            select(Invoice).where(Invoice.invoice_id == new_invoice_id)
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

        try:
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
                raise HTTPException(
                    status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                    detail="Failed to upload file",
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

    invoice = Invoice(
        invoice_id=new_invoice_id,
        already_paid=validated_data.already_paid,
        file_urls=file_urls,
        title=validated_data.title,
        description=validated_data.description,
        is_original=validated_data.is_original,
        is_booked=validated_data.is_booked,
        date_issued=validated_data.date_issued,
        due_date=validated_data.due_date,
        categories=json.loads(validated_data.categories),
        status=PaymentStatus.UNCONFIRMED,
        student_id=student_id,
    )

    session.add(invoice)
    session.commit()
    session.refresh(invoice)

    send_expense_message(
        expense_item=invoice,
        subject="Ny faktura har skapats",
    )

    return Response(
        content="Invoice created successfully",
        status_code=HTTPStatus.CREATED,
    )


@router.get("/all", response_model=list[InvoiceDTO])
async def all_invoices(
    session: SessionDep,
    jwt: Dict[str, Any] = Depends(jwt_required),
):
    student_id = get_jwt_identity(jwt)
    memberships: List[StudentMembership] = StudentMembership.query.filter(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    ).all()

    invoices: List[Invoice] = retrieve_accessible_cost_items(
        session=session,
        cost_item=Invoice,
        memberships=memberships,
    )

    if not invoices:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="No invoices found",
        )

    return [invoice for invoice in invoices]


@router.get(
    "/{invoice_id}",
    response_model=InvoiceResponseDTO,
    responses={
        HTTPStatus.OK: {
            "description": "Invoice retrieved successfully",
        },
        HTTPStatus.NOT_FOUND: {
            "description": "Invoice not found",
        },
        HTTPStatus.UNAUTHORIZED: {
            "description": "Unauthorized",
        },
    },
)
async def get_invoice(
    session: SessionDep,
    invoice_id: Annotated[str, Path(title="The ID of the invoice to retrieve")],
    jwt: Dict[str, Any] = Depends(jwt_required),
):
    invoice = session.exec(
        select(Invoice).where(Invoice.invoice_id == invoice_id)
    ).first()

    student_id = get_jwt_identity(jwt)

    stmt = select(StudentMembership).where(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    )

    memberships = session.exec(stmt).all()

    is_authorized, message = has_access(
        session=session,
        cost_item=invoice,
        student_id=student_id,
        memberships=memberships,
    )

    if not is_authorized:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail=message,
        )

    student = session.exec(
        select(Student).where(Student.student_id == invoice.student_id)
    ).first()
    if not student or not isinstance(student, Student):
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Student not found",
        )

    bank_information = session.exec(
        select(AccountBankInformation).where(
            AccountBankInformation.student_id == student.student_id
        )
    ).first()

    if not bank_information:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Bank information not found",
        )

    thread = session.exec(
        select(Thread).where(Thread.invoice_id == invoice.invoice_id)
    ).first()

    return {
        "invoice": invoice,
        "student": student,
        "bank_information": bank_information,
        "thread": thread if thread else None,
    }


@router.get(
    "/student/{student_id}",
    response_model=list[InvoiceDTO],
)
async def get_invoices_by_student(
    session: SessionDep,
    student_id: Annotated[str, Path(title="The ID of the student to get invoices for")],
    jwt: Dict[str, Any] = Depends(jwt_required),
) -> Response:
    request_student_id = get_jwt_identity(jwt)
    if student_id != request_student_id:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="You are not authorized to view this student's invoices",
        )

    invoices = session.exec(
        select(Invoice)
        .where(Invoice.student_id == student_id)
        .order_by(Invoice.created_at.desc())
    ).all()

    if not invoices:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="No invoices found for this student",
        )

    return [invoice for invoice in invoices]


@router.patch(
    "/{invoice_id}/status",
    responses={
        HTTPStatus.OK: {
            "description": "Invoice status updated successfully",
        },
        HTTPStatus.NOT_FOUND: {
            "description": "Invoice not found",
        },
        HTTPStatus.UNAUTHORIZED: {
            "description": "Unauthorized",
        },
        HTTPStatus.BAD_REQUEST: {
            "description": "No data provided or invalid status",
        },
    },
)
async def update_invoice_status(
    session: SessionDep,
    request: Request,
    invoice_id: Annotated[str, Path(title="The ID of the invoice to update")],
    jwt: Dict[str, Any] = Depends(jwt_required),
) -> Response:
    validated_data = await parse_body(
        request=request,
        model_type=UpdateItemForm,
    )

    invoice = session.exec(
        select(Invoice).where(Invoice.invoice_id == invoice_id)
    ).first()

    if not invoice:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Invoice not found",
        )

    student_id = get_jwt_identity(jwt)

    stmt = select(StudentMembership).where(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    )
    memberships = session.exec(stmt).all()

    has_authority = has_full_authority(session=session, memberships=memberships)
    if not has_authority:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="You do not have permission to update this invoice",
        )

    status: str = validated_data.status
    if not status:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="No status provided",
        )

    invoice_status = PaymentStatus[invoice.status.name]
    new_status = PaymentStatus[status.upper()]

    if new_status < invoice_status:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="You cannot change the status to a lower value",
        )

    previous_status = invoice.status
    thread = Thread.query.filter_by(
        invoice_id=invoice_id,
    ).first()

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
            invoice_id=invoice_id,
            previous_status=previous_status,
            new_status=new_status,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=str(e),
        )

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
    session.commit()

    return Response(
        content="Invoice status updated successfully",
        status_code=HTTPStatus.OK,
    )


@router.patch(
    "/{invoice_id}/categories",
    responses={
        HTTPStatus.OK: {
            "description": "Invoice categories updated successfully",
        },
        HTTPStatus.NOT_FOUND: {
            "description": "Invoice not found",
        },
        HTTPStatus.UNAUTHORIZED: {
            "description": "Unauthorized",
        },
        HTTPStatus.BAD_REQUEST: {
            "description": "No categories provided",
        },
    },
)
async def update_expense_categories(
    session: SessionDep,
    request: Request,
    invoice_id: Annotated[str, Path(title="The ID of the invoice to update")],
    jwt: Dict[str, Any] = Depends(jwt_required),
):
    validated_data = await parse_body(
        request=request,
        model_type=UpdateItemForm,
    )

    invoice = session.exec(
        select(Invoice).where(Invoice.invoice_id == invoice_id)
    ).first()

    if not invoice:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Invoice not found",
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
            detail="No categories provided",
        )

    invoice.categories = json.loads(new_categories)
    session.commit()

    return Response(
        content="Invoice categories updated successfully",
        status_code=HTTPStatus.OK,
    )


@router.delete(
    "/{invoice_id}",
    responses={
        HTTPStatus.OK: {
            "description": "Invoice deleted successfully",
        },
        HTTPStatus.NOT_FOUND: {
            "description": "Invoice not found",
        },
        HTTPStatus.UNAUTHORIZED: {
            "description": "Unauthorized",
        },
    },
)
async def delete_invoice(
    session: SessionDep,
    invoice_id: Annotated[str, Path(title="The ID of the invoice to delete")],
    jwt: Dict[str, Any] = Depends(jwt_required),
) -> Response:
    invoice = session.exec(
        select(Invoice).where(Invoice.invoice_id == invoice_id)
    ).first()

    if not invoice:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Invoice not found",
        )

    student_id = get_jwt_identity(jwt)

    if str(invoice.student_id) != str(student_id):
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="You are not authorized to delete this invoice",
        )

    if invoice.status != PaymentStatus.UNCONFIRMED:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="You cannot delete an invoice that is not unconfirmed",
        )

    session.delete(invoice)
    session.commit()

    return Response(
        content="Invoice deleted successfully",
        status_code=HTTPStatus.OK,
    )


@router.post(
    "/{invoice_id}/messages",
    responses={
        HTTPStatus.CREATED: {
            "description": "Message added successfully",
        },
        HTTPStatus.BAD_REQUEST: {
            "description": "Invalid data provided",
        },
        HTTPStatus.NOT_FOUND: {
            "description": "Invoice not found",
        },
        HTTPStatus.UNAUTHORIZED: {
            "description": "Unauthorized",
        },
    },
)
async def add_invoice_message(
    session: SessionDep,
    request: Request,
    invoice_id: Annotated[str, Path(title="The ID of the invoice")],
    jwt: Dict[str, Any] = Depends(jwt_required),
):
    validated_data = await parse_body(
        request=request,
        model_type=AddMessageDTO,
    )

    invoice = session.exec(
        select(Invoice).where(Invoice.invoice_id == invoice_id)
    ).first()

    if not invoice:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Invoice not found",
        )

    if (
        invoice.status == PaymentStatus.CONFIRMED
        or invoice.status == PaymentStatus.REJECTED
        or invoice.status == PaymentStatus.PAID
        or invoice.status == PaymentStatus.BOOKED
    ):
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="You cannot add a message to an invoice that is already confirmed, rejected, paid, or booked",
        )

    student_id = get_jwt_identity(jwt)
    stmt = select(StudentMembership).where(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    )

    memberships = session.exec(stmt).all()

    is_authorized, message = has_access(
        session=session,
        cost_item=invoice,
        student_id=student_id,
        memberships=memberships,
    )

    if not is_authorized:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail=message,
        )

    thread = session.exec(
        select(Thread).where(Thread.invoice_id == invoice.invoice_id)
    ).first()
    thread_id = thread.thread_id if thread else None

    try:
        add_message(
            thread_id=thread_id,
            sender_id=str(student_id),
            message_text=str(validated_data.message),
            create_thread_if_not_exists=True,
            invoice_id=invoice_id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=str(e),
        )

    return Response(
        content="Message added successfully",
        status_code=HTTPStatus.CREATED,
    )
