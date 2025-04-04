import enum
from sqlalchemy import UUID, Column, Enum, ForeignKey
from models.committees.committee_position import CommitteePosition
from utility.database import db


class RGBankPermissionType(enum.Enum):
    """RGBank permission types."""

    NONE = 0
    OWN_COMMITTEE = 1
    ALL_COMMITTEES = 2


class RGBankPermissions(db.Model):
    __tablename__ = "rgbank_permissions"
    __table_args__ = {"schema": "rgbank"}

    permission_id = Column(UUID(as_uuid=True), primary_key=True, nullable=False)

    permission_level = Column(
        Enum(RGBankPermissionType), nullable=False, default=RGBankPermissionType.NONE
    )

    # Foreign keys
    committee_position_id = Column(
        UUID(as_uuid=True),
        ForeignKey(CommitteePosition.committee_position_id),
        nullable=False,
    )

    # Relationships
    committee_position = db.relationship(
        "CommitteePosition",
        back_populates="rgbank_permissions",
    )

    def __repr__(self):
        return f"<RGBankPermissions {self.name}>"
