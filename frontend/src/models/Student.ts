import { CommitteePosition } from './Committee';

const StudentType = {
  MEDIETEKNIK: 'MEDIETEKNIK',
  THS: 'THS',
  DATATEKNIK: 'DATATEKNIK',
  KTH: 'KTH',
  OTHER: 'OTHER',
} as const

export type StudentType = typeof StudentType[keyof typeof StudentType]

/**
 * @interface Student
 * @description Student model
 * 
 * @param {string} email - Student email
 * @param {string} first_name - Student first name
 * @param {string} last_name - Student last name
 * @param {string} reception_name - Student reception name
 * @param {string} profile_picture_url - Student profile picture URL (optional)
 */
export default interface Student {
  author_type: 'STUDENT';
  student_id: string;
  email: string;
  first_name: string;
  last_name?: string;
  profile_picture_url?: string;
  reception_name?: string;
  reception_profile_picture_url?: string;
  student_type: StudentType;
}

export interface Profile {
  facebook_url: string;
  linkedin_url: string;
  instagram_url: string;
}

/**
 * @interface StudentCommitteePosition
 * @description Student committee position model
 * 
 * @param {CommitteePosition} position - Committee position
 * @param {string} initiation_date - Initiated date
 * @param {string} termination_date - Expected end date
 */
export interface StudentMembership {
  student: Student;
  committee_position_id: string;
  initiation_date: string;
  termination_date: string;
}

export interface IndividualCommitteePosition {
  position: CommitteePosition;
  initiation_date: string;
  termination_date: string;
}
