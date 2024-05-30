from utility.constants import DEFAULT_LANGUAGE_CODE, AVAILABLE_LANGUAGES
from werkzeug.datastructures import MultiDict
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Query
import unicodedata
from typing import Type, Optional, List, Dict


def retrieve_language(args: MultiDict[str, str]) -> str:
    """Retrieves the language from the request arguments

    Args:
        args (MultiDict): Request arguments

    Returns:
        str: Language code
    """
    if args is None:
        return DEFAULT_LANGUAGE_CODE

    language = args.get('language')

    if language not in AVAILABLE_LANGUAGES or language is None:
        return DEFAULT_LANGUAGE_CODE
    return language


def get_translation(
    translation_table: Type[object],
    filter_columns: List[str],
    filter_values: Dict[str, any],
    language_code: str = DEFAULT_LANGUAGE_CODE,
) -> Optional[object]:
    """
    Retrieves a translation object from the given translation table based on the provided filter columns and values.

    Args:
        translation_table (Type[object]): The translation table to query.
        filter_columns (List[str]): The columns to filter by.
        filter_values (Dict[str, any]): The filter values for each column.
        language_code (str, optional): The language code to filter by. Defaults to DEFAULT_LANGUAGE_CODE.

    Returns:
        Optional[object]: The translation object if found, otherwise None.
    """

    # Check if the column exists in the table
    for column in filter_columns:
        if not hasattr(translation_table, column):
            return None

    query: Query = translation_table.query

    # Filter by language code and filter values
    query = query.filter(
        translation_table.language_code == language_code,
        *[
            getattr(translation_table, column) == filter_values[column]
            for column in filter_columns
        ]
    )

    translation = query.first()

    # Fallback 1: Default language code
    if not translation:
        query: Query = translation_table.query
        query = query.filter(
            translation_table.language_code == DEFAULT_LANGUAGE_CODE,
            *[
                getattr(translation_table, column) == filter_values[column]
                for column in filter_columns
            ]
        )
        translation = query.first()

    # Fallback 2: Any language code
    if not translation:
        query: Query = translation_table.query
        query = query.filter(
            *[
                getattr(translation_table, column) == filter_values[column]
                for column in filter_columns
            ]
        )
        translation = query.first()

    return translation


def update_translation_or_create(
    db: SQLAlchemy,
    translation_table: Type[object],
    entries: Dict[str, str],
) -> None:
    """Updates a translation object in the given translation table or creates a new one if it doesn't exist

    Args:
        language_code (str): The language code to filter by.
        translation_table (Type[object]): The translation table to query.
        entries (Dict[str, str]): The entries to update.
    """
    language_code = entries.get('language_code')
    translation_entry = (
        db.session.query(translation_table)
        .filter_by(language_code=language_code)
        .first()
    )

    if translation_entry:
        for column, value in entries.items():
            setattr(translation_entry, column, value)
    else:
        translation_entry = translation_table(**entries)
        db.session.add(translation_entry)

    db.session.commit()


def normalize_to_ascii(text: str) -> str:
    """Converts non-ASCII characters to their closest ASCII equivalents."""
    normalized = unicodedata.normalize(
        "NFKD", text)  # Decompose combined characters
    # Remove diacritics
    return "".join(c for c in normalized if not unicodedata.combining(c))
