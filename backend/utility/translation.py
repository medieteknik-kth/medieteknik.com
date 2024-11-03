"""
A Utility module for handling translations and everything language related
"""

import unicodedata
from typing import Any, Type, Optional, List, Dict
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Query
from werkzeug.datastructures import MultiDict
from utility import AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE_CODE


def convert_iso_639_1_to_bcp_47(code: str) -> str:
    """
    Converts an ISO 639-1 code to BCP 47

        :param code: str - The ISO 639-1 code
        :return: str - The BCP 47 code
    """

    for language in AVAILABLE_LANGUAGES:
        if language == code:
            return language
        if language.startswith(code):
            return language

    return DEFAULT_LANGUAGE_CODE


def retrieve_languages(args: MultiDict[str, str] | None) -> List[str]:
    """
    Retrieves the language from the request arguments

        :param args: MultiDict[str, str] - The request arguments
        :return: List[str] - The list of languages or the available languages if none are found
    """

    if args is None:
        return AVAILABLE_LANGUAGES

    languages = [convert_iso_639_1_to_bcp_47(lang) for lang in args.getlist("language")]

    valid_languages = [lang for lang in languages if lang in AVAILABLE_LANGUAGES]
    return valid_languages if valid_languages else AVAILABLE_LANGUAGES


def get_translation(
    translation_table: Type[object],
    filter_columns: List[str],
    filter_values: Dict[str, Any],
    language_code: str = DEFAULT_LANGUAGE_CODE,
) -> Optional[object]:
    """
    Retrieves a translation object from the given translation table based on
        the provided filter columns and values.

        :param translation_table: Type[object] - The translation table to query.
        :param filter_columns: List[str] - The columns to filter by.
        :param filter_values: Dict[str, Any] - The values to filter by.
        :param language_code: str - The language code to filter by.
        :return: Optional[object] - The translation object or None if not found
    """

    # Check if the column exists in the table
    for column in filter_columns:
        if not hasattr(translation_table, column):
            print(f"Column {column} does not exist in {translation_table}")
            return None

    query: Query = translation_table.query

    # Filter by language code and filter values
    query = query.filter(
        translation_table.language_code == language_code,
        *[
            getattr(translation_table, column) == filter_values[column]
            for column in filter_columns
        ],
    )

    translation = query.first()
    if not translation:
        query: Query = translation_table.query
        query = query.filter(
            translation_table.language_code == DEFAULT_LANGUAGE_CODE,
            *[
                getattr(translation_table, column) == filter_values[column]
                for column in filter_columns
            ],
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
    """
    Updates a translation object in the given translation table
        or creates a new one if it doesn't exist

        :param db: SQLAlchemy - The database session
        :param translation_table: Type[object] - The translation table to query.
        :param entries: Dict[str, str] - The columns and values to update or create
        :return: None
    """

    language_code = entries.get("language_code")
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
    """
    Converts non-ASCII characters to their closest ASCII equivalents.

        :param text: str - The text to normalize
        :return: str - The normalized text
    """

    normalized = unicodedata.normalize("NFKD", text)
    return "".join(c for c in normalized if not unicodedata.combining(c))
