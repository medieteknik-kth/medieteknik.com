from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from models.committees import (
        CommitteeCategoryTranslation,
        CommitteePositionRecruitmentTranslation,
        CommitteePositionTranslation,
        CommitteeTranslation,
    )
    from models.content.album import AlbumTranslation
    from models.content.document import DocumentTranslation
    from models.content.event import EventTranslation
    from models.content.media import MediaTranslation
    from models.content.news import NewsTranslation
    from models.content.tags import TagTranslation
    from models.core.notifications import (
        NotificationsTranslation,
        NotificationSubscription,
    )


class Language(SQLModel, table=True):
    """
    Language model

    Attributes:
        language_code: Primary key (BCP-47)
        language_name: Full name of the given language code
    """

    __tablename__ = "language"

    language_code: str = Field(primary_key=True, index=True)

    language_name: str

    # Relationships
    committee_category_translations: list["CommitteeCategoryTranslation"] = (
        Relationship(back_populates="language")
    )
    committee_translations: list["CommitteeTranslation"] = Relationship(
        back_populates="language"
    )
    committee_position_translations: list["CommitteePositionTranslation"] = (
        Relationship(back_populates="language")
    )
    committee_position_recruitment_translations: list[
        "CommitteePositionRecruitmentTranslation"
    ] = Relationship(back_populates="language")

    media_translations: list["MediaTranslation"] = Relationship(
        back_populates="language"
    )
    album_translations: list["AlbumTranslation"] = Relationship(
        back_populates="language"
    )
    document_translations: list["DocumentTranslation"] = Relationship(
        back_populates="language"
    )
    event_translations: list["EventTranslation"] = Relationship(
        back_populates="language"
    )
    news_translations: list["NewsTranslation"] = Relationship(back_populates="language")
    tag_translations: list["TagTranslation"] = Relationship(back_populates="language")

    notification_subscriptions: list["NotificationSubscription"] = Relationship(
        back_populates="language"
    )
    notifications_translation: list["NotificationsTranslation"] = Relationship(
        back_populates="language"
    )

    def __repr__(self):
        return "<Language %r>" % self.language_code
