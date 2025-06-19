from typing import Any, Dict, List, Tuple, Type, Union

from models.apps.rgbank import (
    AccountBankInformation,
    Expense,
    Invoice,
    RGBankPermissions,
    RGBankViewPermissions,
)
from models.committees.committee import Committee
from models.core import StudentMembership
from utility import log_error


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

    if str(cost_item.student_id) == student_id:
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


def retrieve_accessible_cost_items(
    cost_item: Type[Union[Expense, Invoice]],
    memberships: List[StudentMembership],
    page: int = 1,
) -> List[Expense | Invoice] | None:
    # Gets all costs items the student has access to

    if cost_item is not Expense and cost_item is not Invoice:
        log_error(f"Invalid cost item type. type: {type(cost_item)}")
        return None

    if not memberships:
        return None

    permissions: List[RGBankPermissions] = RGBankPermissions.query.filter(
        RGBankPermissions.committee_position_id.in_(
            [membership.committee_position_id for membership in memberships]
        )
    ).all()

    if not permissions:
        return None

    committee = None
    all_access = False

    for permission in permissions:
        if permission.view_permission_level == RGBankViewPermissions.ALL_COMMITTEES:
            committee = None
            all_access = True
            break

        if permission.view_permission_level == RGBankViewPermissions.OWN_COMMITTEE:
            committee = permission.committee

    if all_access:
        cost_items = cost_item.query.order_by(cost_item.created_at.desc()).all()

    if committee and isinstance(committee, Committee):
        if not cost_item.committee:
            return None

        cost_items = (
            cost_item.query.filter_by(
                cost_item.committee.committee_id == committee.committee_id,
            )
            .order_by(cost_item.created_at.desc())
            .all()
        )

    if not cost_items:
        return None

    return cost_items


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
