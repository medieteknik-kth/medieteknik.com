import uuid
from utility.database import db
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, func


class RevokedTokens(db.Model):
    """
    This table is used to store revoked JWT tokens. In combination with a CRON job, this table is used to revoke tokens and automatically prune the table.

    Attributes:
        id: Primary key
        jti: The JWT ID
        revoked_at: When the token was revoked
        originally_valid_until: When the token was originally valid until
    """

    __tablename__ = "revoked_tokens"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    jti = Column(
        String,
        nullable=False,
        unique=True,
    )

    revoked_at = Column(
        DateTime,
        default=func.now(),
        nullable=False,
    )

    originally_valid_until = Column(
        DateTime,
        nullable=False,
    )

    def __repr__(self):
        return f"<RevokedTokens {self.jti}>"
