from utility import database

db = database.db

class Language(db.Model):
    __tablename__ = 'language'
    language_code = db.Column(db.String(20), primary_key=True, autoincrement=False)
    
    language_name = db.Column(db.String(255))

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
