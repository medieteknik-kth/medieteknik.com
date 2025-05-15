from http import HTTPStatus
from typing import Any, Dict

from fastapi import Cookie, HTTPException
from sqlmodel import Session, select

from config import Settings
from models.core.student import Student
from utility.jwt import decode_jwt


def jwt_required(
    session: Session, token: str = Cookie(..., alias=Settings.JWT_COOKIE_NAME)
) -> Dict[str, Any]:
    return decode_jwt(token=token, session=session)


def get_jwt_identity(jwt_token: Dict[str, Any]) -> str:
    return jwt_token["sub"]


def get_student(session: Session, jwt_token: Dict[str, Any]) -> Student:
    stmt = select(Student).where(Student.id == jwt_token["sub"])
    student = session.exec(stmt).first()

    if not student:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Unauthorized",
        )

    return student
