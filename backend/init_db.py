"""
Utility script for initializing the database on the server. It needs to import all models to create the tables (even though they are not used in the script).

This script is used to create all tables in the database. It is used to initialize the database.
"""

import argparse
from main import app
from sqlalchemy.exc import SQLAlchemyError
from utility import db
from models.utility import Analytics, Audit, Idempotency  # noqa: F401
from models.committees import (
    CommitteeCategory,  # noqa: F401
    CommitteeCategoryTranslation,  # noqa: F401
    Committee,  # noqa: F401
    CommitteeTranslation,  # noqa: F401
    CommitteePosition,  # noqa: F401
    CommitteePositionTranslation,  # noqa: F401
    CommitteePositionRecruitment,  # noqa: F401
    CommitteePositionRecruitmentTranslation,  # noqa: F401
)
from models.content import (
    Album,  # noqa: F401
    AlbumTranslation,  # noqa: F401
    Media,  # noqa: F401
    MediaTranslation,  # noqa: F401
    Document,  # noqa: F401
    DocumentTranslation,  # noqa: F401
    Event,  # noqa: F401
    EventTranslation,  # noqa: F401
    News,  # noqa: F401
    NewsTranslation,  # noqa: F401
    Item,  # noqa: F401
    RepeatableEvent,  # noqa: F401
    Tag,  # noqa: F401
    TagTranslation,  # noqa: F401
)
from models.core import (
    Author,  # noqa: F401
    Calendar,  # noqa: F401
    Student,  # noqa: F401
    Profile,  # noqa: F401
    StudentMembership,  # noqa: F401
    Language,  # noqa: F401
)


def init_db():
    """
    Initializes the database. Only creates new tables if they do not exist.
    """

    print("Initializing database...")
    with app.app_context():
        print("Creating tables...")
        try:
            db.create_all()
        except SQLAlchemyError as sqle:
            print("-" * 25 + " ERROR " + "-" * 25)
            print("[Error] Creating tables: ", sqle)
            print("-" * 57)
            return
    print("-" * 25 + " SUCCESS " + "-" * 25)
    print("All tables successfully created!")
    print("-" * 59)


def drop_db():
    """
    Drops all tables from the database.
    """

    print("Dropping database...")
    with app.app_context():
        print("Dropping tables...")
        try:
            db.drop_all()
        except SQLAlchemyError as sqle:
            print("-" * 25 + " ERROR " + "-" * 25)
            print("[Error] Dropping tables: ", sqle)
            print("-" * 57)
            return
    print("-" * 25 + " SUCCESS " + "-" * 25)
    print("All tables successfully dropped!")
    print("-" * 59)


parser = argparse.ArgumentParser(description="Database initialization script")
parser.add_argument(
    "--recreate", action="store_true", help="Drops all tables and creates new ones"
)

if __name__ == "__main__":
    args = parser.parse_args()
    if args.recreate:
        drop_db()
    init_db()
