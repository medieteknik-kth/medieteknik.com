import enum
import urllib.parse
from typing import List
from sqlalchemy import String, Integer, Column, Boolean, ForeignKey, Enum, inspect
from sqlalchemy.dialects.postgresql import ARRAY
from utility.database import db
from utility.constants import AVAILABLE_LANGUAGES, ROUTES
from utility.translation import get_translation


class Content(db.Model):
    """
    Actual content model for resources

    Attributes:
        content_id: Primary key
        image_urls: List of image URLs that exist in the given route
    """

    __tablename__ = "content"

    content_id = Column(Integer, primary_key=True, autoincrement=True)

    image_urls = Column(ARRAY(String))

    def __repr__(self):
        return "<Content %r>" % self.content_id

    def to_dict(self, provided_languages: List[str] = AVAILABLE_LANGUAGES):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()

        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        if not data:
            return {}

        translations = []

        for language_code in provided_languages:
            translation = get_translation(
                ContentTranslation,
                ["content_id"],
                {"content_id": self.content_id},
                language_code,
            )
            translations.append(translation)

        del data["content_id"]

        data["translations"] = [translation.to_dict() for translation in translations]

        return data


class Resource(db.Model):
    """
    Resource model, used for dynamic content, but not user-generated content e.g. Committee pages

    Attributes:
        resource_id (int): Primary key
        route (str): Route of the resource
        category (ROUTES): Category of the resource
        is_public (bool): Whether the resource is public
    """

    __tablename__ = "resource"

    resource_id = Column(Integer, primary_key=True, autoincrement=True)

    route = Column(String(255), unique=True)
    category = Column(Enum(ROUTES))
    is_public = Column(Boolean, default=True, nullable=False)

    # Foreign keys
    content_id = Column(Integer, ForeignKey("content.content_id"))

    # Relationships
    content = db.relationship("Content", backref="resource")

    def __repr__(self):
        return "<Resource %r>" % self.resource_id

    def to_dict(self, is_public_route=True):
        if self.is_public is not None and self.is_public is False and is_public_route:
            return {}
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()

        data = {}
        for column in columns:
            value = getattr(self, column)
            if isinstance(value, enum.Enum):
                value = value.value
            data[column] = urllib.parse.quote(value)

        if not data:
            return {}

        del data["resource_id"]
        del data["content_id"]

        return data


class ContentTranslation(db.Model):
    __tablename__ = "content_translation"
    content_translation_id = Column(Integer, primary_key=True, autoincrement=True)

    title = Column(String(255))
    bodies = Column(ARRAY(String))

    # Foreign keys
    content_id = Column(Integer, ForeignKey("content.content_id"))
    language_code = Column(String(20), ForeignKey("language.language_code"))

    # Relationships
    content = db.relationship("Content", backref="content_translations")
    language = db.relationship("Language", backref="content_translations")

    def __repr__(self):
        return "<ContentTranslation %r>" % self.content_translation_id

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        if not data:
            return {}

        del data["content_translation_id"]
        del data["content_id"]

        return data
