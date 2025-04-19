import type Committee from '@/models/Committee'
import type { RGBankPermissions } from '@/models/Permission'

/**
 * @name canChangeExpense
 * @description Check if the user can change the expense status
 *
 * @param {Committee[]} studentCommittees - The committees the student is a member of
 * @param {Committee} committee - The committee of the expense (if any)
 * @param {RGBankPermissions} permissions - The permissions of the student (if any)
 * @returns {boolean} - True if the user can change the expense status, false otherwise
 */
export function canChangeExpense(
  studentCommittees: Committee[] = [],
  committee?: Committee,
  permissions?: RGBankPermissions
): boolean {
  if (!permissions) {
    return false
  }

  if (committee) {
    return (
      (studentCommittees.includes(committee) &&
        permissions.view_permission_level >= 1) ||
      permissions.view_permission_level === 2
    )
  }

  return permissions.view_permission_level === 2
}
