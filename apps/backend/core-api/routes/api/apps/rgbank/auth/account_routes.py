from http import HTTPStatus

from cryptography.fernet import Fernet
from fastapi import APIRouter, Depends, Request, Response
from sqlmodel import select

from config import Settings
from decorators.jwt import get_jwt_identity, jwt_required
from dto.apps.rgbank.bank import AccountBankInformationDTO
from models.apps.rgbank import AccountBankInformation
from routes.api.deps import SessionDep
from utility.parser import parse_body

router = APIRouter(
    prefix=Settings.API_ROUTE_PREFIX + "/rgbank/account",
    tags=["RGBank", "Account"],
)


@router.post("/", status_code=HTTPStatus.CREATED)
async def create_account(
    session: SessionDep,
    request: Request,
    jwt=Depends(jwt_required),
):
    validated_data = await parse_body(
        request=request, model_type=AccountBankInformationDTO
    )
    student_id = get_jwt_identity(jwt)

    existing_bank_account = session.exec(
        select(AccountBankInformation).where(
            AccountBankInformation.student_id == student_id
        )
    ).first()

    cipher = Fernet(Settings.FERNET_KEY)

    bank_name = cipher.encrypt(validated_data.bank_name.encode()).decode()
    clearing_number = cipher.encrypt(validated_data.clearing_number.encode()).decode()
    account_number = cipher.encrypt(validated_data.account_number.encode()).decode()

    if existing_bank_account:
        existing_bank_account.bank_name = bank_name
        existing_bank_account.clearing_number = clearing_number
        existing_bank_account.account_number = account_number
    else:
        new_bank_account = AccountBankInformation(
            bank_name=bank_name,
            clearing_number=clearing_number,
            account_number=account_number,
            student_id=student_id,
        )

        session.add(new_bank_account)
    session.commit()
    session.refresh(existing_bank_account or new_bank_account)

    return Response(status_code=HTTPStatus.CREATED)
