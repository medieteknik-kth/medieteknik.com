"""
This module contains the SQLAlchemy database object.
"""

from flask_sqlalchemy import SQLAlchemy

# The SQLAlchemy database object, should be initialized in the application factory and used in the application context. It should not be reinstantiated.
db: SQLAlchemy = SQLAlchemy()
