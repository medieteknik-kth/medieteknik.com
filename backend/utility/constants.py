import enum
DEFAULT_LANGUAGE_CODE = 'sv-SE'
AVAILABLE_LANGUAGES = [DEFAULT_LANGUAGE_CODE, 'en-GB']

API_VERSION = 'v1'
PUBLIC_PATH = f'/api/{API_VERSION}/public'
PROTECTED_PATH = f'/api/{API_VERSION}'
class ROUTES(enum.Enum):
    DYNAMIC = 'dynamic'
    STUDENTS = 'students'
    COMMITTEES = 'committees'
    COMMITTEE_CATEGORIES = 'committee_categories'
    COMMITTEE_POSITIONS = 'committee_positions'
    EVENTS = 'events'
    NEWS = 'news'
    ALBUMS = 'albums'
    DOCUMENTS = 'documents'
    LANGUAGES = 'languages'