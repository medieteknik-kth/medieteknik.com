"""
RGBank Permission Service
"""

from typing import Any, Dict, List

from sqlmodel import Session, select

from models.apps.rgbank import (
    RGBankAccessLevels,
    RGBankPermissions,
    RGBankViewPermissions,
)
from models.committees import CommitteePosition


async def attach_permissions(
    session: Session,
    committee_positions: List[CommitteePosition],
    response_dict: Dict[str, Any],
):
    """
    Attach RGBank permissions to the response dictionary.

    Args:
        session (Session): The database session.
        committee_positions (List[CommitteePosition]): List of committee positions.
        response_dict (Dict[str, Any]): The response dictionary to attach permissions to.
    """
    stmt = select(RGBankPermissions).where(
        RGBankPermissions.committee_position_id.in_(
            [
                committee_position.committee_position_id
                for committee_position in committee_positions
            ]
        )
    )

    rgbank_permissions = session.exec(stmt).all()

    highest_view_permission = RGBankViewPermissions.NONE
    highest_access_level = RGBankAccessLevels.NONE

    for permission in rgbank_permissions:
        if permission.view_permission_level > highest_view_permission:
            highest_view_permission = permission.view_permission_level

        if permission.access_level > highest_access_level:
            highest_access_level = permission.access_level

    response_dict["rgbank_permissions"] = {
        "view_permission_level": highest_view_permission,
        "access_level": highest_access_level,
    }
