import enum
from utility import database
from sqlalchemy import Column, Integer, String, DateTime, UUID, SMALLINT, Enum, ForeignKey

db = database.db

class Result(enum.Enum):
    SUCCESS = 'SUCCESS'
    FAILURE = 'FAILURE'
    
class EndpointCategory(enum.Enum):
    COMMITTEE = 'COMMITTEE'
    EVENT = 'EVENT'
    POST = 'POST'
    DOCUMENT = 'DOCUMENT'
    RESOURCE = 'RESOURCE'
    STUDENT = 'STUDENT'
    ANALYTICS = 'ANALYTICS'
    NOT_SPECIFIED = 'NOT SPECIFIED'

class Analytics(db.Model):
    """
    If users agree to cookies, store the relevant data in this table for analytics purposes.
    """
    __tablename_ = 'analytics'
    
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
    
    def __init__(self, user_id, session_id, geo_location, user_agent, referrer, screen_resolution, landing_page, route, timestamp, time_spent):
        self.user_id = user_id
        self.session_id = session_id
        self.geo_location = geo_location
        self.user_agent = user_agent
        self.referrer = referrer
        self.screen_resolution = screen_resolution
        self.landing_page = landing_page
        self.route = route
        self.timestamp = timestamp
        self.time_spent = time_spent
        
    def __repr__(self):
        return '<Analytics %r>' % self.analytics_id
    
    def to_dict(self):
        return {
            'analytics_id': self.analytics_id,
            'user_id': self.user_id,
            'session_id': self.session_id,
            'geo_location': self.geo_location,
            'user_agent': self.user_agent,
            'referrer': self.referrer,
            'screen_resolution': self.screen_resolution,
            'landing_page': self.landing_page,
            'route': self.route,
            'timestamp': self.timestamp,
            'time_spent': self.time_spent
        }

class Audit(db.Model):
    """
    This table is used to store audit logs for *most* requests made to the API.
    """
    __tablename_ = 'audit'
    audit_id = Column(Integer, primary_key=True, autoincrement=True)
    
    created_at = Column(DateTime, nullable=False)
    action_type= Column(String(8), nullable=False)
    endpoint_category = Column(Enum(EndpointCategory), nullable=False)
    request_params = Column(String(1000))
    response_code = Column(Integer, nullable=False)
    additional_info = Column(String(1000))
    result = Column(Enum(Result), nullable=False, default=Result.SUCCESS)
    
    # Foreign key
    student_id = Column(Integer, ForeignKey('student.student_id'))
    
    # Relationships
    student = db.relationship('Student', backref='audit')
    
    def __init__(self, created_at, action_type, endpoint_category, request_params, response_code, additional_info, result, student_id):
        self.created_at = created_at
        self.action_type = action_type
        self.endpoint_category: EndpointCategory = endpoint_category
        self.request_params = request_params
        self.response_code = response_code
        self.additional_info = additional_info
        self.result: Result = result
        self.student_id = student_id
        
    def __repr__(self):
        return '<Audit %r>' % self.audit_id

    def to_dict(self):
        return {
            'audit_id': self.audit_id,
            'created_at': self.created_at,
            'action_type': self.action_type,
            'endpoint_category': self.endpoint_category.value,
            'request_params': self.request_params,
            'response_code': self.response_code,
            'additional_info': self.additional_info,
            'result': self.result.value,
            'student_id': self.student_id
        }
    
    def create_audit_record(self):
        db.session.add(self)
        db.session.commit()
        return self
        
class Idempotency(db.Model):
    """
    This table is used to store idempotency keys for POST requests.
    """
    __tablename_ = 'idempotency'
    
    idempotency_key = Column(String(255), primary_key=True)
    created_at = Column(DateTime, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    retry_count = Column(Integer, nullable=False)
    
    # Foreign key
    audit_id = Column(Integer, ForeignKey('audit.audit_id'))
    
    # Relationships
    audit = db.relationship('Audit', backref='idempotency')
    
    def __init__(self, idempotency_key, created_at, expires_at, retry_count, audit_id):
        self.idempotency_key = idempotency_key
        self.created_at = created_at
        self.expires_at = expires_at
        self.retry_count = retry_count
        self.audit_id = audit_id
        
    def __repr__(self):
        return '<Idempotency %r>' % self.idempotency_key

    def to_dict(self):
        return {
            'idempotency_key': self.idempotency_key,
            'created_at': self.created_at,
            'expires_at': self.expires_at,
            'retry_count': self.retry_count,
            'audit_id': self.audit_id
        }
        
    def create_idempotency_record(self):
        db.session.add(self)
        db.session.commit()
        return self
    
    def update_idempotency_record(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        db.session.commit()
        return self