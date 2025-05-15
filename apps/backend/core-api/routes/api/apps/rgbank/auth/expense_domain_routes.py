from http import HTTPStatus
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, Path, Response
from sqlmodel import select

from config import Settings
from decorators.jwt import get_jwt_identity, jwt_required
from dto.apps.rgbank.expense import ExpenseDomainDTO, UpdateExpenseDomainDTO
from models.apps.rgbank import ExpenseDomain
from models.core import StudentMembership
from routes.api.deps import SessionDep
from services.apps.rgbank.auth_service import has_full_access

router = APIRouter(
    prefix=Settings.API_ROUTE_PREFIX + "/rgbank/expense-domains",
    tags=["RGBank", "Expense Domain"],
)


@router.post(
    "/",
    responses={
        HTTPStatus.FORBIDDEN: {"description": "Unauthorized to create expense domain"},
        HTTPStatus.BAD_REQUEST: {"description": "Invalid request data"},
        HTTPStatus.CREATED: {"description": "Expense domain created"},
    },
)
async def create_expense_domain(
    session: SessionDep,
    expense_domain: ExpenseDomainDTO,
    jwt=Depends(jwt_required),
):
    """
    Creates a new expense domain
        :return: Response - The response object, 201 if successful
    """

    student_id = get_jwt_identity(jwt)
    positions_stmt = select(StudentMembership).where(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    )

    positions = session.exec(positions_stmt).all()

    full_access, msg = has_full_access(session=session, memberships=positions)

    if not full_access:
        raise HTTPException(status_code=HTTPStatus.FORBIDDEN, detail=msg)

    new_domain = ExpenseDomain(
        title=expense_domain.title,
        parts=expense_domain.parts,
        committee_id=expense_domain.committee_id,
    )

    session.add(new_domain)
    session.commit()
    session.refresh(new_domain)

    return Response(status_code=HTTPStatus.CREATED, content=new_domain.model_dump())


@router.put(
    "/{expense_domain_id}",
    responses={
        HTTPStatus.FORBIDDEN: {"description": "Unauthorized to update expense domain"},
        HTTPStatus.NOT_FOUND: {"description": "Expense domain not found"},
        HTTPStatus.NO_CONTENT: {"description": "Expense domain updated"},
    },
)
async def update_expense_domain(
    session: SessionDep,
    expense_domain_id: Annotated[str, Path(title="Expense Domain ID")],
    new_domain_data: UpdateExpenseDomainDTO,
    jwt=Depends(jwt_required),
) -> Response:
    """
    Updates an expense domain
        :return: Response - The response object, 200 if successful
    """

    student_id = get_jwt_identity(jwt)
    positions_stmt = select(StudentMembership).where(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    )

    positions: List[StudentMembership] = session.exec(positions_stmt).all()

    full_access, msg = has_full_access(session=session, memberships=positions)
    if not full_access:
        raise HTTPException(status_code=HTTPStatus.FORBIDDEN, detail=msg)

    expense_domain = session.exec(
        select(ExpenseDomain).where(ExpenseDomain.id == expense_domain_id)
    ).first()

    if not expense_domain:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Expense domain not found",
        )

    if new_domain_data.title:
        expense_domain.title = new_domain_data.title

    if new_domain_data.parts:
        expense_domain.parts = new_domain_data.parts

    session.commit()

    return Response(status_code=HTTPStatus.NO_CONTENT)


@router.delete(
    "/{expense_id}",
    responses={
        HTTPStatus.FORBIDDEN: {"description": "Unauthorized to delete expense domain"},
        HTTPStatus.NOT_FOUND: {"description": "Expense domain not found"},
        HTTPStatus.NO_CONTENT: {"description": "Expense domain deleted"},
    },
)
async def delete_expense_domain(
    session: SessionDep,
    expense_id: Annotated[str, Path(title="Expense Domain ID")],
    jwt=Depends(jwt_required),
) -> Response:
    """
    Deletes an expense domain
        :return: Response - The response object, 200 if successful
    """

    student_id = get_jwt_identity(jwt)
    positions_stmt = select(StudentMembership).where(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    )
    positions: List[StudentMembership] = session.exec(positions_stmt).all()

    full_access, msg = has_full_access(session=session, memberships=positions)

    if not full_access:
        raise HTTPException(status_code=HTTPStatus.FORBIDDEN, detail=msg)

    expense_domain = session.exec(
        select(ExpenseDomain).where(ExpenseDomain.id == expense_id)
    ).first()

    if not expense_domain:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Expense domain not found",
        )

    session.delete(expense_domain)
    session.commit()

    return Response(status_code=HTTPStatus.NO_CONTENT)
