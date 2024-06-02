from utility.database import db
from sqlalchemy import Column, String

class Language(db.Model):
    """
    Language model

    Attributes:
        language_code: Primary key (BCP-47)
        language_name: Full name of the given language code
    """

    __tablename__ = 'language'

    language_code = Column(String(20), primary_key=True, autoincrement=False)
    
    language_name = Column(String(255), nullable=False)

    def __repr__(self):
        return '<Language %r>' % self.language_id

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
