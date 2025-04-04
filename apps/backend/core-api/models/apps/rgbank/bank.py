import uuid
from sqlalchemy import UUID, Column, ForeignKey, String, text
from models.core.student import Student
from utility.database import db


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
    sorting_number = Column(String(6), nullable=False)
    account_number = Column(String(13), nullable=False)

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
