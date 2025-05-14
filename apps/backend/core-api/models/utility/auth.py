import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel, func


class RevokedTokens(SQLModel, table=True):
    """
    This table is used to store revoked JWT tokens. In combination with a CRON job, this table is used to revoke tokens and automatically prune the table.

    Attributes:
        id: Primary key
        jti: The JWT ID
        revoked_at: When the token was revoked
        originally_valid_until: When the token was originally valid until
    """

    __tablename__ = "revoked_tokens"

    id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    jti: uuid.UUID = Field(
        unique=True,
    )

    revoked_at: datetime = Field(
        default_factory=func.now,
    )

    originally_valid_until: datetime

    def __repr__(self):
        return f"<RevokedTokens {self.jti}>"
