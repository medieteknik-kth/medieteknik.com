import uuid
from typing import List
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy import inspect
from utility.database import db
from utility.constants import AVAILABLE_LANGUAGES
from utility.translation import get_translation
from models.content.base import Item


class News(Item):
    """
    News model which inherits from the base Item model.

    Attributes:
        news_id: Primary key
    """

    news_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    url = Column(String(length=512), nullable=True, index=True)

    # Foreign keys
    item_id = Column(UUID(as_uuid=True), ForeignKey("item.item_id"))

    # Relationships
    item = db.relationship("Item", back_populates="news")
    translations = db.relationship("NewsTranslation", back_populates="news")

    __mapper_args__ = {"polymorphic_identity": "news"}

    def to_dict(
        self, provided_languages: List[str] = AVAILABLE_LANGUAGES, is_public_route=True
    ):
        base_data = super().to_dict(
            provided_languages=provided_languages, is_public_route=is_public_route
        )

        if not base_data:
            return None

        translations = []

        for language_code in provided_languages:
            translation = get_translation(
                NewsTranslation, ["news_id"], {"news_id": self.news_id}, language_code
            )
            translations.append(translation)

        del base_data["news_id"]

        base_data["translations"] = [
            translation.to_dict() for translation in translations
        ]

        return base_data


class NewsTranslation(db.Model):
    __tablename__ = "news_translation"

    news_translation_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    title = Column(String(255))
    body = Column(String(100_000))
    short_description = Column(String(255))
    main_image_url = Column(String(2096))
    sub_image_urls = Column(ARRAY(String))

    # Foreign keys
    news_id = Column(UUID(as_uuid=True), ForeignKey("news.news_id"))
    language_code = Column(String(20), ForeignKey("language.language_code"))

    # Relationships
    news = db.relationship("News", back_populates="translations")
    language = db.relationship("Language", back_populates="news_translations")

    def to_dict(self):
        columns = inspect(self.__class__)

        if not columns:
            return {}

        columns = columns.mapper.column_attrs.keys()

        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        del data["news_translation_id"]
        del data["news_id"]

        return data
