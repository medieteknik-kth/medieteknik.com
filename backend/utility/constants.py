import enum
DEFAULT_LANGUAGE_CODE = 'se'
AVAILABLE_LANGUAGES = ['se', 'en']

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