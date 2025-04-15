import uuid
from os import environ
from cryptography.fernet import Fernet
from sqlalchemy import UUID, Column, ForeignKey, String, text
from models.core import Student
from utility import db


class AccountBankInformation(db.Model):
    __tablename__ = "account_bank_information"
    __table_args__ = {"schema": "rgbank"}

    bank_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    bank_name = Column(String, nullable=False)
    clearing_number = Column(String, nullable=False)
    account_number = Column(String, nullable=False)

    # Foreign Keys
    student_id = Column(
        UUID(as_uuid=True),
        ForeignKey(Student.student_id),
        nullable=False,
        index=True,
    )

    # Relationships
    student = db.relationship(
        "Student", back_populates="rgbank_account_bank_information"
    )

    def __repr__(self):
        return f"<AccountBankInformation {self.bank_id}>"

    def to_dict(self):
        cipher = Fernet(environ.get("FERNET_KEY"))

        return {
            "bank_name": cipher.decrypt(self.bank_name.encode()).decode(),
            "clearing_number": cipher.decrypt(self.clearing_number.encode()).decode(),
            "account_number": cipher.decrypt(self.account_number.encode()).decode(),
        }
