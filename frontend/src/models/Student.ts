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
export interface Student {
  email: string;
  first_name: string;
  last_name: string;
  reception_name: string;
  profile_picture_url?: string;
}