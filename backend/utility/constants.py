import enum
DEFAULT_LANGUAGE_CODE = 'se'

API_VERSION = 'v1'
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