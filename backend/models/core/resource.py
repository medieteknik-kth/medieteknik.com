from utility.database import db
from sqlalchemy import String, Integer, Column, Boolean, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import ARRAY
from utility.constants import ROUTES
from utility.translation import get_translation

class Content(db.Model):
    """
    Actual content model for resources

    Attributes:
        content_id: Primary key
        image_urls: List of image URLs that exist in the given route
    """
    __tablename__ = 'content'

    content_id = Column(Integer, primary_key=True, autoincrement=True)
    
    image_urls = Column(ARRAY(String))
        
    def __repr__(self):
        return '<Content %r>' % self.content_id
    
    def to_dict(self, language_code='se'):
        translation: ContentTranslation | None = get_translation(
            ContentTranslation,
            ['content_id'],
            {'content_id': self.content_id},
            language_code
        )
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}

        data['translation'] = translation.to_dict() if translation else {}

        return data
    
class Resource(db.Model):
    """
    Resource model, used for dynamic content, but not user-generated content e.g. Committee pages

    Attributes:
        resource_id (int): Primary key
        route (str): Route of the resource
        category (ROUTES): Category of the resource
        is_public (bool): Whether the resource is public
    """
    __tablename__ = 'resource'

    resource_id = Column(Integer, primary_key=True, autoincrement=True)
    
    route = Column(String(255), unique=True)
    category = Column(Enum(ROUTES))
    is_public = Column(Boolean, default=True, nullable=False)
    
    # Foreign keys
    content_id = Column(Integer, ForeignKey('content.content_id'))
    
    # Relationships
    content = db.relationship('Content', backref='resource')
        
    def __repr__(self):
        return '<Resource %r>' % self.resource_id
    
    def to_dict(self, is_public_route=True):
        if not self.is_public and is_public_route:
            return {}
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class ContentTranslation(db.Model):
    __tablename__ = 'content_translation'
    content_translation_id = Column(Integer, primary_key=True, autoincrement=True)
    
    title = Column(String(255))
    bodies = Column(ARRAY(String))
    
    # Foreign keys
    content_id = Column(Integer, ForeignKey('content.content_id'))
    language_code = Column(String(20), ForeignKey('language.language_code'))
    
    # Relationships
    content = db.relationship('Content', backref='content_translations')
    language = db.relationship('Language', backref='content_translations')
        
    def __repr__(self):
        return '<ContentTranslation %r>' % self.content_translation_id
    
    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}