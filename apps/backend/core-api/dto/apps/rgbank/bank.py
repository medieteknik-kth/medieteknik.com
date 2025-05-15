import msgspec


class AccountBankInformationDTO(msgspec.Struct):
    bank_name: str
    clearing_number: str
    account_number: str
