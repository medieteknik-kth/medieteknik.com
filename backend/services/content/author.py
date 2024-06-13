from datetime import datetime
from models.core.student import Student
from models.committees import Committee, CommitteePosition
from models.content import AuthorType, Author
from utility.translation import normalize_to_ascii
from utility import database
from utility.constants import DEFAULT_LANGUAGE_CODE, AVAILABLE_LANGUAGES
from sqlalchemy.orm import Query
from typing import Dict, Type

db = database.db

def get_author_from_email(entity_table: Type[Student | Committee | CommitteePosition], 
                          entity_email: str) -> Author | None:

    entity = entity_table.query.filter_by(email=entity_email).first()

    if entity is None:
        return None

    entity_id = -1
    entity_type = None

    if type(entity) == Student:
        entity_id = entity.student_id
        entity_type = AuthorType.STUDENT
    elif type(entity) == Committee:
        entity_id = entity.committee_id
        entity_type = AuthorType.COMMITTEE
    elif type(entity) == CommitteePosition:
        entity_id = entity.committee_position_id
        entity_type = AuthorType.COMMITTEE_POSITION

    return Author.query.filter_by(entity_id=entity_id, author_type=entity_type).first()