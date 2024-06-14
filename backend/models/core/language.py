from sqlalchemy import Column, String, inspect
from utility.database import db


class Language(db.Model):
    """
    Language model

    Attributes:
        language_code: Primary key (BCP-47)
        language_name: Full name of the given language code
    """

    __tablename__ = "language"

    language_code = Column(String(20), primary_key=True, autoincrement=False)

    language_name = Column(String(255), nullable=False)

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        return data
