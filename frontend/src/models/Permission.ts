export const Role = {
  ADMIN: 'ADMIN',
  COMMITTEE_MEMBER: 'COMMITTEE_MEMBER',
  STUDENT: 'STUDENT',
  OTHER: 'OTHER',
}
export type Role = (typeof Role)[keyof typeof Role]

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
}

export type Permission = (typeof Permission)[keyof typeof Permission]
