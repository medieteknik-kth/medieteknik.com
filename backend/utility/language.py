from utility.constants import DEFAULT_LANGUAGE_CODE, AVAILABLE_LANGUAGES
from werkzeug.datastructures import MultiDict

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