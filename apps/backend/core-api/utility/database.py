"""
This module contains the SQLAlchemy database object.
"""

from sqlmodel import create_engine

from config import Settings

engine = create_engine(str(Settings.SQLALCHEMY_DATABASE_URI))
