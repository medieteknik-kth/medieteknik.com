from utility.database import db
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey


class Idempotency(db.Model):
    """
    This table is used to store idempotency keys for POST requests.

    Attributes:
        idempotency_key: Primary key
        created_at: When the idempotency key was created
        expires_at: When the idempotency key expires
        retry_count: Number of times the idempotency key has been retried
        audit_id: Foreign key to the audit table
    """
    __tablename__ = 'idempotency'
    
    idempotency_key = Column(String(255), primary_key=True)
    created_at = Column(DateTime, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    retry_count = Column(Integer, nullable=False)
    
    # Foreign key
    audit_id = Column(Integer, ForeignKey('audit.audit_id'))
    
    # Relationships
    audit = db.relationship('Audit', backref='idempotency')
        
    def __repr__(self):
        return '<Idempotency %r>' % self.idempotency_key

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}