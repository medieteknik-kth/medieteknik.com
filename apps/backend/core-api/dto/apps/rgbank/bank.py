from pydantic import BaseModel


class AccountBankInformationDTO(BaseModel):
    bank_name: str
    clearing_number: str
    account_number: str
