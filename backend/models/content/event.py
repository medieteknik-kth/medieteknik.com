import enum
from utility.constants import DEFAULT_LANGUAGE_CODE
from utility.translation import get_translation
from utility.database import db
from models.content.base import Item
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import Column, ForeignKey, Integer, DateTime, String, Enum

class EventStatus(enum.Enum):
    UPCOMING = 'UPCOMING'
    ONGOING = 'ONGOING'
    PAST = 'PAST'

class Event(Item):
    """
    Event model which inherits from the base Item model.

    Attributes:
        event_id: Primary key
        start_date: The start date of the event
        end_date: The end date of the event
        status: The status of the event
        location: The location of the event
    """
    event_id = Column(Integer, primary_key=True, autoincrement=True)

    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(Enum(EventStatus), default=EventStatus.UPCOMING, nullable=False)
    location = Column(String(255))

    # Foreign keys
    item_id = Column(Integer, ForeignKey('item.item_id'))

    # Relationships
    item = db.relationship('Item', backref='event')

    __mapper_args__ = {
        'polymorphic_identity': 'event'
    }

    def to_dict(self, language_code=DEFAULT_LANGUAGE_CODE, is_public_route=True):
        translation: EventTranslation | None = get_translation(
            EventTranslation,
            ['event_id'],
            {'event_id': self.event_id},
            language_code
        )
        base_dict = super().to_dict(is_public_route)

        del base_dict['event_id']

        base_dict['start_date'] = self.start_date
        base_dict['end_date'] = self.end_date
        base_dict['status'] = self.status
        base_dict['location'] = self.location
        base_dict['translation'] = translation.to_dict() if translation else {}

        return base_dict

class EventTranslation(db.Model):
    __tablename__ = 'event_translation'

    event_translation_id = Column(
        Integer, primary_key=True, autoincrement=True)

    title = Column(String(255))
    body = Column(String(2500))
    short_description = Column(String(255))
    main_image_url = Column(String(255))
    sub_image_urls = Column(ARRAY(String))

    # Foreign keys
    event_id = Column(Integer, ForeignKey('event.event_id'))
    language_code = Column(String(20), ForeignKey('language.language_code'))

    # Relationships
    event = db.relationship('Event', backref='translation')
    language = db.relationship('Language', backref='event_translation')

    def to_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        
        del data['event_translation_id']
        del data['event_id']

        return data

class RepeatableEvents(db.Model):
    __tablename__ = 'repeatable_events'

    repeatable_event_id = Column(Integer, primary_key=True, autoincrement=True)

    # Metadata
    reapeting_interval = Column(String(255))

    # Foreign keys
    event_id = Column(Integer, ForeignKey('event.event_id'))

    # Relationships
    event = db.relationship('Event', backref='repeatable_events')