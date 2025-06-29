import enum
import uuid
from sqlalchemy import UUID, Column, Enum, ForeignKey, MetaData, text
from sqlalchemy.ext.hybrid import hybrid_property
from models.committees import CommitteePosition
from models.committees.committee import Committee
from utility import db


class RGBankViewPermissions(enum.IntEnum):
    """RGBank permission types."""

    NONE = 0
    OWN_COMMITTEE = 1
    ALL_COMMITTEES = 2


class RGBankAccessLevels(enum.IntEnum):
    """RGBank permission types."""

    NONE = 0
    VIEW = 1
    EDIT = 2


class RGBankPermissions(db.Model):
    __tablename__ = "rgbank_permissions"
    __table_args__ = {"schema": "rgbank"}

    permission_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
        default=uuid.uuid4,
    )

    view_permission_level = Column(
        Enum(RGBankViewPermissions, metadata=MetaData(schema="rgbank")),
        nullable=False,
        default=RGBankViewPermissions.NONE,
    )
    access_level = Column(
        Enum(RGBankAccessLevels, metadata=MetaData(schema="rgbank")),
        nullable=False,
        default=RGBankAccessLevels.NONE,
    )

    # Foreign keys
    committee_position_id = Column(
        UUID(as_uuid=True),
        ForeignKey(CommitteePosition.committee_position_id),
        nullable=False,
        unique=True,
    )

    # Relationships
    committee_position = db.relationship(
        "CommitteePosition",
        back_populates="rgbank_permissions",
    )

    @hybrid_property
    def committee(self) -> Committee:
        """Committee relationship."""
        return self.committee_position.committee

    @committee.expression
    def committee(cls):
        """Committee relationship expression."""
        return cls.committee_position.committee

    def __repr__(self):
        return f"<RGBankPermissions {self.name}>"
