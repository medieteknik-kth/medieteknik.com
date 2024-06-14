from sqlalchemy import Column, Integer, String, DateTime, UUID, SMALLINT, inspect
from utility.database import db


class Analytics(db.Model):
    """
    If users agree to cookies, store the relevant data in this table for analytics purposes.

    Attributes:
        analytics_id (int): Primary key
        user_id (int): ID of the user
        session_id (UUID): ID of the session
        geo_location (str): Approximate geographic location of the user
        user_agent (str): What browser/OS the user is using
        referrer (str): What referer the user came from
        screen_resolution (str): User's screen resolution
        landing_page (str): Where the user first landed
        route (str): The URL of the current page
        timestamp (datetime): When the session started
        time_spent (int): Time spent on a page
    """

    __tablename__ = "analytics"

    analytics_id = Column(Integer, primary_key=True, autoincrement=True)

    # User data
    user_id = Column(Integer)

    # Session data
    session_id = Column(UUID, index=True, unique=True)
    geo_location = Column(String(255))

    # Browser/Device data
    user_agent = Column(String(255))
    referrer = Column(String(255))
    screen_resolution = Column(String(255))

    # Page data
    landing_page = Column(String(255))
    route = Column(String(255))
    timestamp = Column(DateTime)
    time_spent = Column(SMALLINT)

    def __repr__(self):
        return "<Analytics %r>" % self.analytics_id

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        return data
