from utility.constants import DEFAULT_LANGUAGE_CODE, AVAILABLE_LANGUAGES
from werkzeug.datastructures import MultiDict
from sqlalchemy.orm import Query
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
    
    
    