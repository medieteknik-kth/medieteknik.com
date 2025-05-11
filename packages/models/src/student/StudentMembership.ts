import type { CommitteePosition } from '../committee'
import type { Student } from './Student'

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
