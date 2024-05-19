import argparse
from main import app
from utility.database import db
from models.language import Language
from models.student import Student
from models.analytics import Analytics, Audit, Idempotency
from models.items import News, Event, Document, Album
from models.items import NewsTranslation, EventTranslation, DocumentTranslation, AlbumTranslation, RepeatableEvents
from models.committee import CommitteeCategory, Committee, CommitteePosition
from models.committee import CommitteeCategoryTranslation, CommitteeTranslation, CommitteePositionTranslation
from models.resource import Resource, Content, ContentTranslation
from models.student import StudentPositions
from models.shared_table import committee_position_resource

def init_db():
    print('Initializing database...')
    with app.app_context():
        print('Creating tables...')
        try:
            db.create_all()
        except Exception as e:
            print('-' * 25 + ' ERROR ' + '-' * 25)
            print('Error creating tables:', e)
            print('-' * 57)
            return
    
    print('-' * 25 + ' SUCCESS ' + '-' * 25)
    print('All tables successfully created!')
    print('-' * 59)
    
def drop_db():
    print('Dropping database...')
    with app.app_context():
        print('Dropping tables...')
        try:
            db.drop_all()
        except Exception as e:
            print('-' * 25 + ' ERROR ' + '-' * 25)
            print('Error dropping tables:', e)
            print('-' * 57)
            return
    
    print('-' * 25 + ' SUCCESS ' + '-' * 25)
    print('All tables successfully dropped!')
    print('-' * 59)

parser = argparse.ArgumentParser(description='Database initialization script')
parser.add_argument('--recreate', action='store_true', help='Drop all tables')

if __name__ == '__main__':
    args = parser.parse_args()
    if args.recreate:
        drop_db()
    init_db()