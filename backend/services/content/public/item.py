from models.content import Item, Author
from utility.constants import AVAILABLE_LANGUAGES
from sqlalchemy.orm import Query
from typing import Type


def get_items(item_table: Type[Item] = Item, 
              provided_languages: list[str] = AVAILABLE_LANGUAGES) -> dict:
    """
    Retrieves all items from the item table.

    Args:
        item_table (Type[Item], optional): The item table to use. Defaults to Item.
        language_code (list[str], optional): The language codes to use. Defaults to AVAILABLE_LANGUAGES.

    Returns:
        dict: A dictionary containing the items and pagination information.
    """

    paginated_items = item_table.query.paginate()

    items = paginated_items.items
    items_dict = [item_dict for item in items if (item_dict := item.to_dict(provided_languages=provided_languages, is_public_route=True)) is not None]
    return {
        "items": items_dict,
        "page": paginated_items.page,
        "per_page": paginated_items.per_page,
        "total_pages": paginated_items.pages,
        "total_items": paginated_items.total,
    }


def get_items_from_author(author: Author, 
                          item_table: Type[Item] = Item, 
                          provided_languages: list[str] = AVAILABLE_LANGUAGES) -> Query:
    """
    Retrieves all items from the given author.

    Args:
        author (Author): The author to retrieve items from.
        item_table (Type[Item], optional): The item table to use. Defaults to Item.
        language_code (list[str], optional): The language codes to use. Defaults to AVAILABLE_LANGUAGES.

    Returns:
        dict: A dictionary containing the items and pagination information.    
    """

    paginated_items = item_table.query.filter_by(author_id=author.id).paginate()

    items = paginated_items.items
    items_dict = [item.to_dict(provided_languages=provided_languages, is_public_route=True) for item in items]
    return {
            "items": items_dict,
            "page": paginated_items.page,
            "per_page": paginated_items.per_page,
            "total_pages": paginated_items.pages,
            "total_items": paginated_items.total,
        }


def get_item_by_url(url: str, 
                    item_table: Type[object] = Item, 
                    provided_languages: list[str] = AVAILABLE_LANGUAGES) -> dict | None:

    item: Item | None = item_table.query.filter_by(url=url).first()

    if not item:
        return None
    item: Item = item

    return item.to_dict(provided_languages=provided_languages, is_public_route=True)