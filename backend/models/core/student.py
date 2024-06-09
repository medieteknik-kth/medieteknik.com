from utility.database import db
from utility.reception_mode import RECEPTION_MODE
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import Boolean, String, Integer, Column, ForeignKey, DateTime, Enum, func
import enum


class StudentType(enum.Enum):
    """
    The type of student. Used for differentiating where the student originates from.

    Attributes:
        MEDIETEKNIK (str): Students from Medieteknik. Takes precedence over all other types, meaning that if a student is apart of multiple groups, they will be shown as MEDIETEKNIK.
        THS (str): Students only from THS, will be shown as THS.
        DATATEKNIK (str): Students only from Datateknik, will be shown as DATATEKNIK.
        KTH (str): Most other students will be shown as KTH, will be shown as KTH.
        OTHER (str): Special case for students who are not part of any of the above groups, will not be shown as anything unique.
    """
    MEDIETEKNIK = 'MEDIETEKNIK'
    THS = 'THS'
    DATATEKNIK = 'DATATEKNIK'
    KTH = 'KTH'
    OTHER = 'OTHER'

class Student(db.Model):
    """
    Model for students in the database.

    Attributes:
        student_id (int): Primary key
        email (str): Email address
        first_name (str): First name
        last_name (str): Last name
        reception_name (str): Reception name
        profile_picture_url (str): URL to profile picture
        reception_profile_picture_url (str): URL to reception profile picture
        student_type (StudentType): Type of student
    """
    __tablename__ = 'student'

    student_id = Column(Integer, primary_key=True, autoincrement=True)

    email = Column(String(255), unique=True, nullable=False, index=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255))
    reception_name = Column(String(255))
    profile_picture_url = Column(String(255))
    reception_profile_picture_url = Column(String(255))
    student_type = Column(Enum(StudentType), nullable=False,
                          default=StudentType.MEDIETEKNIK)

    def __repr__(self):
        return '<Student %r>' % self.student_id

    def to_dict(self, is_public_route=True):
        data = {c.name: getattr(self, c.name).value if isinstance(getattr(self, c.name), enum.Enum) else getattr(self, c.name)
                for c in self.__table__.columns}

        del data['student_id']    
    
        if is_public_route:
            if RECEPTION_MODE:
                del data['email']
            del data['reception_name']
            del data['reception_profile_picture_url']
            data['first_name'] = self.reception_name if RECEPTION_MODE and self.reception_name else self.first_name
            data['last_name'] = '' if RECEPTION_MODE and self.reception_name else self.last_name
            data['profile_picture_url'] = self.reception_profile_picture_url if RECEPTION_MODE and self.reception_profile_picture_url else self.profile_picture_url

        return data


class Profile(db.Model):
    """
    Model for student profiles in the database.

    Attributes:
        profile_id (int): Primary key
        notifications_enabled (bool): Whether notifications are enabled
        notification_emails (list): List of emails to send notifications to
        phone_number (str): Phone number
        facebook_url (str): Facebook URL
        linkedin_url (str): LinkedIn URL
        instagram_url (str): Instagram URL
        student_id (int): Foreign key to student table
    """
    __tablename__ = 'profile'

    profile_id = Column(Integer, primary_key=True, autoincrement=True)
    
    notifications_enabled = Column(Boolean, default=True)
    notification_emails = Column(ARRAY(String(255)))

    phone_number = Column(String(255))
    facebook_url = Column(String(255))
    linkedin_url = Column(String(255))
    instagram_url = Column(String(255))

    # Foreign keys
    student_id = Column(Integer, ForeignKey('student.student_id'))

    # Relationships
    student = db.relationship('Student', backref='profile')

    def __repr__(self):
        return '<Profile %r>' % self.profile_id
    
    def to_dict(self, is_public_route=True):
        if is_public_route:
            return {}

        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        
        del data['profile_id']
        del data['student_id']

        return data



class StudentPositions(db.Model):
    """
    Model for student positions in the database. Used for both history and current positions.

    Attributes:
        student_positions_id (int): Primary key
        initiation_date (DateTime): Date and time of initiation
        termination_date (DateTime): Date and time of termination
        student_id (int): Foreign key to student
        committee_position_id (int): Foreign key to committee position
    """
    __tablename__ = 'student_positions'

    student_positions_id = Column(
        Integer, primary_key=True, autoincrement=True)

    initiation_date = Column(DateTime)
    termination_date = Column(DateTime)

    # Foreign keys
    student_id = Column(Integer, ForeignKey('student.student_id'))
    committee_position_id = Column(Integer, ForeignKey(
        'committee_position.committee_position_id'))

    # Relationships
    student = db.relationship('Student', backref='student_positions')
    committee_position = db.relationship(
        'CommitteePosition', backref='student_positions')

    def __repr__(self):
        return '<StudentPositions %r>' % self.student_positions_id

    def to_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}

        del data['student_positions_id']
        del data['student_id']
        del data['committee_position_id']

        return data

    def is_active(self, current_date=func.now()):
        return self.initiation_date < current_date and (self.termination_date is None or self.termination_date > current_date)
