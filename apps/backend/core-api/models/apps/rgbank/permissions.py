import enum
import uuid
from typing import TYPE_CHECKING

from sqlalchemy.ext.hybrid import hybrid_property
from sqlmodel import Field, MetaData, Relationship, SQLModel

from models.committees.committee import Committee

if TYPE_CHECKING:
    from models.committees.committee_position import CommitteePosition


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


class RGBankPermissions(SQLModel, table=True):
    __tablename__ = "rgbank_permissions"
    __table_args__ = {"schema": "rgbank"}

    permission_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    view_permission_level: RGBankViewPermissions = Field(
        default=RGBankViewPermissions.NONE,
        sa_column_kwargs={"metadata": MetaData(schema="rgbank")},
    )
    access_level: RGBankAccessLevels = Field(
        default=RGBankAccessLevels.NONE,
        sa_column_kwargs={"metadata": MetaData(schema="rgbank")},
    )

    # Foreign keys
    committee_position_id: uuid.UUID = Field(
        foreign_key="committee_position.committee_position_id",
        index=True,
        unique=True,
    )

    # Relationships
    committee_position: "CommitteePosition" = Relationship(
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
