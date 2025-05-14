import os
from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException
from jose import JWTError, jwt
from sqlmodel import Session, select

from models.utility.auth import RevokedTokens


def create_jwt(subject: Any, expires_delta: int | None = None, **extra_claims):
    claims = {"exp": expires_delta, "sub": str(subject), **extra_claims}
    encoded_jwt = jwt.encode(
        claims=claims, key=os.getenv("SECRET_KEY"), algorithm="HS256"
    )
    return encoded_jwt


def decode_jwt(token: str, session: Session):
    try:
        payload = jwt.decode(
            token=token, key=os.getenv("SECRET_KEY"), algorithms=["HS256"]
        )

        stmt = select(RevokedTokens).where(RevokedTokens.jti == payload["jti"])
        revoked_token = session.exec(stmt).first()
        if revoked_token:
            raise HTTPException(
                status_code=401,
                detail="Token has been revoked",
            )
        return payload

    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid token") from e


def revoke_jwt(token: str, session: Session):
    payload = decode_jwt(token, session)
    exp_datetime = datetime.fromtimestamp(timestamp=payload["exp"], tz=timezone.utc)
    revoked_token = RevokedTokens(
        jti=payload["jti"], originally_valid_until=exp_datetime
    )
    session.add(revoked_token)
    session.commit()
