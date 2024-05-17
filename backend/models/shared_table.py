from utility import database
from sqlalchemy import Column, Integer, ForeignKey

db = database.db

committee_position_resource = db.Table(
    'committee_position_resource', db.Model.metadata,
    Column('committee_position_id', Integer, ForeignKey('committee_position.committee_position_id')),
    Column('resource_id', Integer, ForeignKey('resource.resource_id'))
)