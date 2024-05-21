from utility import database
from sqlalchemy import Column, String

db = database.db

class Language(db.Model):
    __tablename__ = 'language'
    language_code = Column(String(20), primary_key=True, autoincrement=False)
    
    language_name = Column(String(255), nullable=False)

    def __init__(self, language_code, language_name):
        self.language_code = language_code
        self.language_name = language_name

    def __repr__(self):
        return '<Language %r>' % self.language_id

    def to_dict(self):
        return {
            'language_code': self.language_code,
            'language_name': self.language_name
        }
