import enum
from utility.database import db
from sqlalchemy import Column, Integer, DateTime, String, Enum, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import ARRAY

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

    created_at = Column(DateTime)
    last_updated = Column(DateTime)
    categories = Column(ARRAY(String))
    is_pinned = Column(Boolean, default=False, nullable=False)
    is_public = Column(Boolean, default=True, nullable=False)
    published_status = Column(Enum(PublishedStatus),
                              default=PublishedStatus.DRAFT, nullable=False)
    url = Column(String(255))

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
            return {}
        
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}

        if is_public_route:
            if self.published_status == PublishedStatus.DRAFT:
                return {}
        
        return data