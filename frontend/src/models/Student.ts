import { CommitteePosition } from './Committee';

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
  type: 'student';
  email: string;
  firstName: string;
  lastName: string;
  receptionName: string;
  profilePictureUrl: string;
}

export interface CommitteePositionOccupant extends Student {
  position: CommitteePosition
}