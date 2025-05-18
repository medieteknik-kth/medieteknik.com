import msgspec

from dto.committees.committee_position import ProtectedCommitteePositionDTO


class CommitteeTranslationDTO(msgspec.Struct):
    title: str
    description: str
    language_code: str


class CommitteeDTO(msgspec.Struct):
    email: str
    group_photo_url: str | None = None
    logo_url: str
    total_news: int
    total_events: int
    total_documents: int
    total_media: int
    hidden: bool
    translations: list[CommitteeTranslationDTO]

    @classmethod
    def from_orm_with_language(cls, obj, language_code: str) -> "CommitteeDTO":
        """
        Create a CommitteeDTO from an ORM object and a language code.
        """
        # Filter translations by the specified language code
        translations = [
            translation
            for translation in obj.translations
            if translation.language_code == language_code
        ]

        # Create a new CommitteeDTO instance with the filtered translations
        return cls(
            email=obj.email,
            group_photo_url=obj.group_photo_url,
            logo_url=obj.logo_url,
            total_news=obj.total_news,
            total_events=obj.total_events,
            total_documents=obj.total_documents,
            total_media=obj.total_media,
            hidden=obj.hidden,
            translations=translations,
        )


class CommitteeDataDTO(msgspec.Struct):
    members: list[CommitteeMemberDTO]
    positions: list[ProtectedCommitteePositionDTO]
    total_news: int
    total_events: int
    total_documents: int
    total_media: int

    @classmethod
    def from_orm_with_language(cls, obj, language_code: str) -> "CommitteeDataDTO":
        """
        Create a CommitteeDataDTO from an ORM object and a language code.
        """
        positions = [
            ProtectedCommitteePositionDTO.from_orm_with_language(
                position, language_code
            )
            for position in obj.positions
        ]

        # Create a new CommitteeDataDTO instance with the filtered translations
        return cls(
            members=obj.members,
            positions=positions,
            total_news=obj.total_news,
            total_events=obj.total_events,
            total_documents=obj.total_documents,
            total_media=obj.total_media,
        )


class UpdateCommitteeDTO(msgspec.Struct):
    translations: list[CommitteeTranslationDTO]
    logo_url: str | None = None
    group_photo_url: str | None = None
