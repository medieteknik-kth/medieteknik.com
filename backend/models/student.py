from utility import database
from utility.reception_mode import RECEPTION_MODE
from sqlalchemy import String, Integer, Column, ForeignKey, DateTime, Enum, func
import enum

db = database.db

class StudentType(enum.Enum):
    MEDIETEKNIK = 'MEDIETEKNIK'
    THS = 'THS'
    DATATEKNIK = 'DATATEKNIK'
    KTH = 'KTH'
    OTHER = 'OTHER'

class Student(db.Model):
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

    def __init__(self, email, first_name, last_name, reception_name, profile_picture_url, reception_profile_picture_url, student_type):
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.reception_name = reception_name
        self.profile_picture_url = profile_picture_url
        self.reception_profile_picture_url = reception_profile_picture_url
        self.student_type: StudentType = student_type

    def __repr__(self):
        return '<Student %r>' % self.student_id

    def to_dict(self, is_public_route=True):

        if is_public_route:
            return {
                'student_id': self.student_id,
                'name': self.reception_name if RECEPTION_MODE and self.reception_name else f'{self.first_name} {self.last_name}',
                'profile_picture_url': self.reception_profile_picture_url if RECEPTION_MODE and self.reception_profile_picture_url else self.profile_picture_url,
                'student_type': self.student_type.value
            }

        return {
            'student_id': self.student_id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'reception_name': self.reception_name,
            'profile_picture_url': self.profile_picture_url,
            'reception_profile_picture_url': self.reception_profile_picture_url,
            'student_type': self.student_type.value
        }


class StudentPositions(db.Model):
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

    def __init__(self, student_id, committee_position_id, initiation_date, termination_date):
        self.student_id = student_id
        self.committee_position_id = committee_position_id
        self.initiation_date = initiation_date
        self.termination_date = termination_date

    def __repr__(self):
        return '<StudentPositions %r>' % self.student_positions_id

    def to_dict(self):
        return {
            'student_positions_id': self.student_positions_id,
            'student_id': self.student_id,
            'committee_position_id': self.committee_position_id,
            'initiation_date': self.initiation_date,
            'termination_date': self.termination_date,
        }

    def is_active(self, current_date=func.now()):
        return self.initiation_date < current_date and (self.termination_date is None or self.termination_date > current_date)
