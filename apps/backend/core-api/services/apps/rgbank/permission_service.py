from typing import Any, Dict, List
from models.apps.rgbank import (
    RGBankAccessLevels,
    RGBankPermissions,
    RGBankViewPermissions,
)
from models.committees import CommitteePosition


def attach_permissions(
    committee_positions: List[CommitteePosition], response_dict: Dict[str, Any]
) -> None:
    rgbank_permissions: List[RGBankPermissions] = RGBankPermissions.query.filter(
        RGBankPermissions.committee_position_id.in_(
            [
                committee_position.get("committee_position_id")
                for committee_position in committee_positions
            ]
        )
    ).all()

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
