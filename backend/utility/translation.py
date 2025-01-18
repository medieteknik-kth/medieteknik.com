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
    Converts an ISO 639-1 language code to a BCP 47 language code

    :param code: The ISO 639-1 language code (e.g., 'en')
    :type code: str
    :return: The BCP 47 language code (e.g., 'en-US')
    :rtype: str
    """

    for language in AVAILABLE_LANGUAGES:
        if language == code:
            return language
        if language.startswith(code):
            return language

    return DEFAULT_LANGUAGE_CODE


def retrieve_languages(args: MultiDict[str, str] | None) -> List[str]:
    """
    Retrieves the languages from the request arguments.

    :param args: The request arguments
    :type args: MultiDict[str, str], optional
    :return: The list of languages or all available languages if none are provided
    :rtype: List[str]
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
    Retrieves a translation object from the translation table based on the filter columns and values

    :param translation_table: The translation table to query
    :type translation_table: Type[object]
    :param filter_columns: The columns to filter by
    :type filter_columns: List[str]
    :param filter_values: The values to filter by
    :type filter_values: Dict[str, Any]
    :param language_code: The language code to filter by
    :type language_code: str, optional
    :return: The translation object or None if not found
    :rtype: Optional[object]
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
    Updates a translation entry or creates a new one if it does not exist

    :param db: The SQLAlchemy database object
    :type db: SQLAlchemy
    :param translation_table: The translation table to query
    :type translation_table: Type[object]
    :param entries: The entries to update or create
    :type entries: Dict[str, str]
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
    Normalizes a text to ASCII characters, removing diacritics and accents (e.g., é -> e)

    :param text: The text to normalize
    :type text: str
    :return: The normalized text
    :rtype: str
    """

    normalized = unicodedata.normalize("NFKD", text)
    return "".join(c for c in normalized if not unicodedata.combining(c))
