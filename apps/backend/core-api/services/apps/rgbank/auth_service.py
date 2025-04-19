from typing import Any, Dict, List, Tuple
from models.apps.rgbank import (
    Expense,
    Invoice,
    RGBankPermissions,
    RGBankViewPermissions,
)
from models.apps.rgbank.bank import AccountBankInformation
from models.core.student import StudentMembership


def has_access(
    cost_item: Expense | Invoice, student_id: str, memberships: List[StudentMembership]
) -> Tuple[bool, str]:
    """
    Check if the student can view the expense based on their memberships.

    :param cost_item: The cost item (Expense or Invoice) to check access for.
    :type cost_item: Expense | Invoice
    :param student_id: The ID of the student.
    :type student_id: str
    :param memberships: List of StudentMembership objects for the student.
    :type memberships: List[StudentMembership]
    :return: True if the student can view the expense, False otherwise.
    :rtype: bool
    """

    if not isinstance(cost_item, (Expense, Invoice)):
        return (False, f"Invalid cost item type. type: {type(cost_item)}")

    if cost_item.student_id == student_id:
        return (True, "You are the owner of this expense.")

    if not memberships:
        return (False, "You are not a member of any committee.")

    permissions: List[RGBankPermissions] = RGBankPermissions.query.filter(
        RGBankPermissions.committee_position_id.in_(
            [membership.committee_position_id for membership in memberships]
        )
    ).all()

    if not permissions:
        return (False, "You do not have any permissions.")

    has_permission_to_all = any(
        permission.view_permission_level == RGBankViewPermissions.ALL_COMMITTEES
        for permission in permissions
    )

    if has_permission_to_all:
        return (True, "You have permission to view all committees.")

    has_permission_to_own_committee = any(
        permission.view_permission_level == RGBankViewPermissions.OWN_COMMITTEE
        for permission in permissions
    )

    if not has_permission_to_own_committee:
        return (False, "You do not have permission to view this expense.")

    if not cost_item.committee:
        return (False, "This expense does not belong to any committee.")

    for membership in memberships:
        return (
            cost_item.committee.committee_id
            == membership.committee_position.committee_id,
            "You have permission to view this expense in your committee.",
        )

    return (False, "You do not have permission to view this expense.")


def has_full_authority(memberships: List[StudentMembership]) -> Tuple[bool, str]:
    """Check if the student has full authority over the expense.

    :param student_id: The ID of the student.
    :type student_id: str
    :param memberships: List of StudentMembership objects for the student.
    :type memberships: List[StudentMembership]
    :return: True if the student has full authority, False otherwise.
    :rtype: bool
    """
    if not memberships:
        return (False, "You are not a member of any committee.")

    permissions: List[RGBankPermissions] = RGBankPermissions.query.filter(
        RGBankPermissions.committee_position_id.in_(
            [membership.committee_position_id for membership in memberships]
        )
    ).all()

    if not permissions:
        return (False, "You do not have any permissions.")

    return (
        any(
            permission.view_permission_level == RGBankViewPermissions.ALL_COMMITTEES
            for permission in permissions
        ),
        "You have permission to view all committees.",
    )


def get_bank_account(student_id: str) -> Dict[str, Any] | None:
    """
    Get the bank account of the student.

    :param student_id: The ID of the student.
    :type student_id: str
    :return: The bank account of the student.
    :rtype: str
    """
    bank: AccountBankInformation | None = AccountBankInformation.query.filter_by(
        student_id=student_id
    ).first()

    if not bank or not isinstance(bank, AccountBankInformation):
        return None

    return bank.to_dict()
