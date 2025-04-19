/**
 * @name Role
 * @description This enum is used to define the roles of the application.
 */
export const Role = {
  ADMIN: 'ADMIN',
  COMMITTEE_MEMBER: 'COMMITTEE_MEMBER',
  STUDENT: 'STUDENT',
  OTHER: 'OTHER',
} as const

/**
 * Represents a type that extracts the values of the `Role` object.
 * This type is a union of all the values of the `Role` object.
 */
export type Role = (typeof Role)[keyof typeof Role]

/**
 * @name Permission
 * @description This enum is used to define the permissions of the application.
 */
export const Permission = {
  STUDENT_EDIT_PERMISSIONS: 'STUDENT_EDIT_PERMISSIONS',
  STUDENT_ADD: 'STUDENT_ADD',
  STUDENT_DELETE: 'STUDENT_DELETE',
  STUDENT_EDIT: 'STUDENT_EDIT',
  STUDENT_VIEW: 'STUDENT_VIEW',
  COMMITTEE_EDIT_PERMISSIONS: 'COMMITTEE_EDIT_PERMISSIONS',
  COMMITTEE_ADD: 'COMMITTEE_ADD',
  COMMITTEE_DELETE: 'COMMITTEE_DELETE',
  COMMITTEE_EDIT: 'COMMITTEE_EDIT',
  COMMITTEE_ADD_MEMBER: 'COMMITTEE_ADD_MEMBER',
  COMMITTEE_REMOVE_MEMBER: 'COMMITTEE_REMOVE_MEMBER',
  COMMITTEE_EDIT_MEMBER: 'COMMITTEE_EDIT_MEMBER',
  COMMITTEE_POSITION_EDIT_PERMISSIONS: 'COMMITTEE_POSITION_EDIT_PERMISSIONS',
  COMMITTEE_POSITION_ADD: 'COMMITTEE_POSITION_ADD',
  COMMITTEE_POSITION_DELETE: 'COMMITTEE_POSITION_DELETE',
  COMMITTEE_POSITION_EDIT: 'COMMITTEE_POSITION_EDIT',
  ITEMS_EDIT: 'ITEMS_EDIT',
  ITEMS_VIEW: 'ITEMS_VIEW',
  ITEMS_DELETE: 'ITEMS_DELETE',
  CALENDAR_PRIVATE: 'CALENDAR_PRIVATE',
  CALENDAR_CREATE: 'CALENDAR_CREATE',
  CALENDAR_DELETE: 'CALENDAR_DELETE',
  CALENDAR_EDIT: 'CALENDAR_EDIT',
} as const

/**
 * Represents a type that extracts the values of the `Permission` object.
 * This type is a union of all the values of the `Permission` object.
 */
export type Permission = (typeof Permission)[keyof typeof Permission]

export interface RGBankPermissions {
  access_level: number
  view_permission_level: number
}
