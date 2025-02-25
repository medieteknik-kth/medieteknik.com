"""
Author Service
"""

from typing import Type

from sqlalchemy import or_
from models.core.student import Student
from models.committees import Committee, CommitteePosition
from models.core import AuthorType, Author


def get_author_from_email(
    entity_table: Type[Student | Committee | CommitteePosition], email: str
) -> Author | None:
    """
    Retrieves an author from an email

    Args:
        entity_table (Type[Student | Committee | CommitteePosition]): The entity table to use
        email (str): The email of the entity

    Returns:
        Author | None: The author or None if not found
    """
    entity = entity_table.query.filter_by(email=email).first()

    if not entity:
        return None

    entity_id = ""
    entity_type = None

    if isinstance(entity, Student):
        entity_id = entity.student_id
        entity_type = AuthorType.STUDENT
    elif isinstance(entity, Committee):
        entity_id = entity.committee_id
        entity_type = AuthorType.COMMITTEE
    elif isinstance(entity, CommitteePosition):
        entity_id = entity.committee_position_id
        entity_type = AuthorType.COMMITTEE_POSITION

    return Author.query.filter(
        Author.author_type == entity_type.value,
        or_(
            Author.student_id == entity_id,
            Author.committee_id == entity_id,
            Author.committee_position_id == entity_id,
        ),
    ).first()
