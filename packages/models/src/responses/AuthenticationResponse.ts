import type { CommitteePosition } from '../committee'
import type { Committee } from '../committee/Committee'
import type { AuthorResource } from '../student/AuthorResource'
import type { Permission } from '../student/Permission'
import type { Student } from '../student/Student'

/**
 * The response object from the server when a user logs in.
 * @interface AuthenticationResponse
 * @property {Student} student - The student object of the authenticated user.
 * @property {Role} role - The role of the student, will be 'OTHER' as a default.
 * @property {Object} permissions - The permissions of the student based on their role, some students will not have permissions.
 * @property {AuthorResource[]} permissions.author - Authorial permissions for the student, e.g. create news articles.
 * @property {Permission[]} permissions.student - Advanced permissions for the student, e.g. edit permissions of other students.
 * @property {Committee[]} committees - The committees the student is a member of if any.
 * @property {CommitteePosition[]} positions - The positions the student holds in committees or independent, if any.
 * @property {number} expiration - The expiration date of the authentication token in milliseconds since epoch.
 */
export interface SuccessfulAuthenticationResponse {
  student: Student
  role: 'OTHER'
  permissions: {
    author: AuthorResource[]
    student: Permission[]
  }
  committees: Committee[]
  committee_positions: CommitteePosition[]
  expiration: number
}

/**
 * The response object from the server when a user fails to log in.
 * @interface FailedAuthenticationResponse
 * @property {string} error - The error message from the server.
 */
export interface FailedAuthenticationResponse {
  error: string
}
