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

    # Relationships
    committee_category_translations = db.relationship(
        "CommitteeCategoryTranslation", back_populates="language"
    )
    committee_translations = db.relationship(
        "CommitteeTranslation", back_populates="language"
    )
    committee_position_translations = db.relationship(
        "CommitteePositionTranslation", back_populates="language"
    )
    committee_position_recruitment_translations = db.relationship(
        "CommitteePositionRecruitmentTranslation", back_populates="language"
    )

    album_translations = db.relationship("AlbumTranslation", back_populates="language")
    document_translations = db.relationship(
        "DocumentTranslation", back_populates="language"
    )
    event_translations = db.relationship("EventTranslation", back_populates="language")
    news_translations = db.relationship("NewsTranslation", back_populates="language")
    tag_translations = db.relationship("TagTranslation", back_populates="language")

    content_translations = db.relationship(
        "ContentTranslation", back_populates="language"
    )

    def __repr__(self):
        return "<Language %r>" % self.language_code

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        return data
