"""
A Utility module for handling translations and everything language related
"""

from typing import Any, Dict, List, Optional, Type

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


def retrieve_languages(
    args: MultiDict[str, str] | None, fallback: bool = True
) -> List[str]:
    """
    Retrieves the languages from the request arguments.

    :param args: The request arguments
    :type args: MultiDict[str, str], optional
    :param fallback: Whether to fallback to all available languages if none are provided, defaults to True
    :type fallback: bool, optional
    :return: The list of languages or all available languages if none are provided
    :rtype: List[str]
    """

    if args is None:
        if fallback:
            return AVAILABLE_LANGUAGES
        else:
            raise ValueError("No languages provided")

    languages = [convert_iso_639_1_to_bcp_47(lang) for lang in args.getlist("language")]

    valid_languages = [lang for lang in languages if lang in AVAILABLE_LANGUAGES]
    return (
        valid_languages if valid_languages else AVAILABLE_LANGUAGES if fallback else []
    )


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
