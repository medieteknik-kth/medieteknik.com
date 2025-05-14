import uuid

from sqlmodel import Field, Relationship, SQLModel

from models.core import Student


class AccountBankInformation(SQLModel, table=True):
    __tablename__ = "account_bank_information"
    __table_args__ = {"schema": "rgbank"}

    bank_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    bank_name: str
    clearing_number: str
    account_number: str

    # Foreign Keys
    student_id: uuid.UUID = Field(
        foreign_key="student.student_id",
        index=True,
    )

    # Relationships
    student: "Student" = Relationship(
        back_populates="rgbank_account_bank_information",
    )

    def __repr__(self):
        return f"<AccountBankInformation {self.bank_id}>"
