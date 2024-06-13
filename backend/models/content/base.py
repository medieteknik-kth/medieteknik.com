import enum
from utility.database import db
from .author import Author
from sqlalchemy import Column, Integer, DateTime, String, Enum, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.inspection import inspect

class PublishedStatus(enum.Enum):
    """
    Represents the availability status of an item.

    Attributes:
        DRAFT: The item is not published, only accessible by the author
        PUBLISHED: The item is published, accessible by everyone
    """
    DRAFT = 'DRAFT'
    PUBLISHED = 'PUBLISHED'

class Item(db.Model):
    """
    Represents a generic item, meant for user-generated content e.g. news.

    Attributes:
        item_id: Primary key
        created_at: When the item was created
        last_updated: When the item was last updated
        categories: List of categories that the item belongs to
        is_pinned: Whether the item is pinned
        is_public: Whether the item is public
        published_status: The status of the item
        url: The URL of the item
        author_id: The author of the item
        type: Discriminator column for SQLAlchemy inheritance
    
    """
    __tablename__ = 'item'

    item_id = Column(Integer, primary_key=True, autoincrement=True)

    created_at = Column(DateTime, default=None)
    last_updated = Column(DateTime , default=None)
    categories = Column(ARRAY(String), default=[])
    is_pinned = Column(Boolean, default=False, nullable=False)
    is_public = Column(Boolean, default=False, nullable=False)
    published_status = Column(Enum(PublishedStatus),
                              default=PublishedStatus.DRAFT, nullable=False)
    url = Column(String(255), nullable=False)

    # Foreign keys
    author_id = Column(Integer, ForeignKey('author.author_id'))

    # Relationships
    author = db.relationship('Author', backref='item')

    # Polymorphism
    type = Column(String(50))
    __mapper_args__ = {
        'polymorphic_identity': 'item',
        'polymorphic_on': type
    }

    def __repr__(self) -> str:
        return f'<Item {self.item_id}, {self.type}>'
    
    def to_dict(self, is_public_route=True) -> dict:
        if not self.is_public and is_public_route:
            return None

        if is_public_route:
            if self.published_status == PublishedStatus.DRAFT:
                return None
            
        columns = inspect(self).mapper.column_attrs.keys() 
        data = {c: getattr(self, c).value if isinstance(getattr(self, c), enum.Enum) else getattr(self, c)
                for c in columns
                }
        
        author_data: Author | None = Author.query.filter_by(author_id=self.author_id).first()
        if author_data:
            author_data: Author = author_data   
            corrected_author_dict = author_data.retrieve_author().to_dict()
            corrected_author_dict['author_type'] = author_data.author_type.value
            data['author'] = corrected_author_dict
        else:
            data['author'] = {}
        
        del data['item_id']
        del data['author_id']

        return data