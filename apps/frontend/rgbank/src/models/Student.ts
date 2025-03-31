import type { CommitteePosition } from '@/models/Committee'

/**
 * @enum STUDENT_TYPES
 * @description Student types, used to categorize students
 */
export const STUDENT_TYPES = {
  MEDIETEKNIK: 'MEDIETEKNIK',
  THS: 'THS',
  DATATEKNIK: 'DATATEKNIK',
  KTH: 'KTH',
  OTHER: 'OTHER',
} as const

/**
 * Represents a type that extracts the values of the `STUDENT_TYPES` object.
 * This type is a union of all the values of the `STUDENT_TYPES` object.
 */
export type StudentType = (typeof STUDENT_TYPES)[keyof typeof STUDENT_TYPES]

/**
 * @interface Student
 * @description Student model
 *
 * @property {string} author_type - The type of the author
 * @property {string} student_id - The student ID
 * @property {string} email - The student email will be optional in reception mode.
 * @property {string} first_name - The student first name
 * @property {string} last_name - The student last name (optional)
 * @property {string} profile_picture_url - The student profile picture URL (optional)
 * @property {string} reception_name - The reception name (optional)
 * @property {string} reception_profile_picture_url - The reception profile picture URL (optional)
 * @property {StudentType} student_type - The student type
 */
export default interface Student {
  author_type: 'STUDENT'
  student_id: string
  email?: string
  first_name: string
  last_name?: string
  profile_picture_url?: string
  reception_name?: string
  reception_profile_picture_url?: string
  student_type: StudentType
}

/**
 * @interface StudentProfile
 * @description Student profile model
 *
 * @property {string} facebook_url - The student's Facebook URL
 * @property {string} linkedin_url - The student's LinkedIn URL
 * @property {string} instagram_url - The student's Instagram URL
 */
export interface Profile {
  facebook_url: string
  linkedin_url: string
  instagram_url: string
}

/**
 * @interface StudentMembership
 * @description Student membership model
 *
 * @property {Student} student - The student
 * @property {string} student_membership_id - The student membership ID
 * @property {CommitteePosition} committee_position_id - The committee position ID
 * @property {string} initiation_date - The initiation date
 * @property {string} termination_date - The termination date
 */
export interface StudentMembership {
  student: Student
  student_membership_id: string
  committee_position_id: string
  initiation_date: string
  termination_date: string
}

/**
 * @interface StudentCommitteePosition
 * @description Student committee position model
 *
 * @property {Student} student - The student
 * @property {CommitteePosition} position - The committee position
 * @property {string} initiation_date - The initiation date
 * @property {string} termination_date - The termination date
 */
export interface StudentCommitteePosition {
  student: Student
  position: CommitteePosition
  initiation_date: string
  termination_date: string
}

/**
 * @interface IndividualCommitteePosition
 * @description Individual committee position model
 *
 * @property {CommitteePosition} position - The committee position
 * @property {string} initiation_date - The initiation date
 * @property {string} termination_date - The termination date
 */
export interface IndividualCommitteePosition {
  position: CommitteePosition
  initiation_date: string
  termination_date: string
}
