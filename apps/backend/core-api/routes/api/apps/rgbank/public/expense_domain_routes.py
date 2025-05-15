from http import HTTPStatus

from fastapi import APIRouter
from flask import Response
from sqlmodel import select

from config import Settings
from dto.apps.rgbank.expense import ExpenseDomainDTO
from models.apps.rgbank import ExpenseDomain
from routes.api.deps import SessionDep

router = APIRouter(
    prefix=Settings.API_ROUTE_PREFIX + "public/rgbank/expense-domains",
    tags=["RGBank", "Public", "Expense Domain"],
)


@router.get("/", response_model=list[ExpenseDomainDTO], status_code=HTTPStatus.OK)
async def get_all_expense_domains(session: SessionDep) -> Response:
    """
    Gets all expense domains
        :return: Response - The response object, 200 if successful
    """

    return session.exec(select(ExpenseDomain)).all()
