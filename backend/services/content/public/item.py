from models.content import Item, Author
from utility.constants import AVAILABLE_LANGUAGES
from typing import Any, Dict, Type, List


def get_items(
    item_table: Type[Item] = Item,
    provided_languages: list[str] = AVAILABLE_LANGUAGES,
) -> Dict[str, Any]:
    """
    Retrieves all items from the item table.

    Args:
        item_table (Type[Item], optional): The item table to use. Defaults to Item.
        language_code (list[str], optional): The language codes to use. Defaults to AVAILABLE_LANGUAGES.

    Returns:
        Dict[str, Any]: A dictionary containing the items and pagination information.
    """

    paginated_items = item_table.query.paginate()

    items = paginated_items.items
    items_dict = [
        item_dict
        for item in items
        if (
            item_dict := item.to_dict(
                provided_languages=provided_languages, is_public_route=True
            )
        )
        is not None
    ]
    return {
        "items": items_dict,
        "page": paginated_items.page,
        "per_page": paginated_items.per_page,
        "total_pages": paginated_items.pages,
        "total_items": paginated_items.total,
    }


def get_items_from_author(
    author: Author,
    item_table: Type[Item] = Item,
    provided_languages: list[str] = AVAILABLE_LANGUAGES,
) -> Dict[str, Any]:
    """
    Retrieves all items from the given author.

    Args:
        author (Author): The author to retrieve items from.
        item_table (Type[Item], optional): The item table to use. Defaults to Item.
        language_code (list[str], optional): The language codes to use. Defaults to AVAILABLE_LANGUAGES.

    Returns:
        Dict[str, Any]: A dictionary containing the items and pagination information.
    """

    paginated_items = item_table.query.filter_by(author_id=author.author_id).paginate()

    items = paginated_items.items
    items_dict = [
        item.to_dict(provided_languages=provided_languages, is_public_route=True)
        for item in items
    ]
    return {
        "items": items_dict,
        "page": paginated_items.page,
        "per_page": paginated_items.per_page,
        "total_pages": paginated_items.pages,
        "total_items": paginated_items.total,
    }


def get_item_by_url(
    url: str,
    item_table: Type[Item] = Item,
    provided_languages: list[str] = AVAILABLE_LANGUAGES,
) -> Dict[str, Any] | None:
    """
    Retrieves an item from the item table by its URL.

    Args:
        url (str): The URL of the item.
        item_table (Type[Item], optional): The item table to use. Defaults to Item.
        language_code (list[str], optional): The language codes to use. Defaults to AVAILABLE_LANGUAGES.

    Returns:
        Dict[str, Any] | None: The item as a dictionary or None if the item is not found.
    """

    item = item_table.query.filter_by(url=url).first()

    if not item or not isinstance(item, Item):
        return None

    return item.to_dict(provided_languages=provided_languages, is_public_route=True)


def get_latest_items(
    item_table: Type[Item] = Item,
    count: int = 5,
    provided_languages: List[str] = AVAILABLE_LANGUAGES,
) -> Dict[str, Any]:
    """
    Retrieves the latest items from the item table.

    Args:
        item_table (Type[Item], optional): The item table to use. Defaults to Item.
        count (int, optional): The number of items to retrieve. Defaults to 5.

    Returns:
        Dict[str, Any]: A dictionary containing the <count> latest items.
    """

    items: List[Item] = (
        item_table.query.order_by(Item.created_at.desc()).limit(count).all()
    )

    return [
        item_dict
        for item in items
        if (
            item_dict := item.to_dict(
                provided_languages=provided_languages, is_public_route=True
            )
        )
        is not None
    ]
