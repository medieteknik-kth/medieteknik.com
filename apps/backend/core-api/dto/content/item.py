import msgspec

from dto.core.author import AuthorDTO


class ItemDTO(msgspec.Struct):
    item_id: str
    created_at: str
    last_updated: str
    categories: list[str] | None = []
    is_pinned: bool = False
    is_public: bool = False
    author: AuthorDTO
