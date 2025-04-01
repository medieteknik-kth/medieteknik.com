import type Committee from '@/models/Committee'
import type { CommitteePosition } from '@/models/Committee'
import type { AuthorResource } from '@/models/Items'
import type { Permission, Role } from '@/models/Permission'
import type Student from '@/models/Student'

interface AuthenticationState {
  /**
   * The student object of the authenticated user.
   */
  student: Student | null

  /**
   * The authentication status of the student.
   */
  isAuthenticated: boolean

  /**
   * The role of the student.
   */
  role: Role

  /**
   * The permissions of the student based on their role.
   * author: Authorial permissions for the student, e.g. create news articles.
   * student: Advanced permissions for the student, e.g. edit permissions of other students.
   */
  permissions: {
    author?: AuthorResource[]
    student?: Permission[]
  }

  /**
   * The committees the student is a member of.
   */
  committees: Committee[]

  /**
   * The positions the student holds in committees or independent.
   */
  committee_positions: CommitteePosition[]

  /**
   * The error message if any error occurs during authentication.
   */
  error: string | null

  /**
   * The loading status of the authentication.
   */
  isLoading: boolean

  /**
   * The status of the user data. True if the data is stale, false otherwise.
   */
  stale: boolean
}

export interface AuthenticationContextType extends AuthenticationState {
  login: (
    email: string,
    password: string,
    csrf_token: string,
    remember?: boolean
  ) => Promise<boolean>
  logout: () => void
  setStale: (stale: boolean) => void
}

type AuthenticationAction =
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | {
      type: 'SET_STUDENT_DATA'
      payload: {
        student: Student
        committees: Committee[]
        committee_positions: CommitteePosition[]
        role: Role
        permissions: {
          author: AuthorResource[]
          student: Permission[]
        }
      }
    }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_STALE'; payload: boolean }

export const initialState: AuthenticationState = {
  student: null,
  isAuthenticated: false,
  role: 'OTHER',
  permissions: {
    author: [],
    student: [],
  },
  committees: [],
  committee_positions: [],
  error: null,
  isLoading: true,
  stale: true,
}

/**
 * Reducer function for handling authentication state changes based on the given action type.
 *
 * @param {AuthenticationState} state - The current state of the authentication.
 * @param {AuthenticationAction} action - The action to be performed on the authentication state.
 * @returns {AuthenticationState} The updated authentication state after applying the action.
 */
export function authenticationReducer(
  state: AuthenticationState,
  action: AuthenticationAction
): AuthenticationState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        error: null,
      }

    case 'LOGOUT':
      return {
        ...state,
        student: null,
        permissions: {
          author: [],
          student: [],
        },
        role: 'OTHER',
        committees: [],
        committee_positions: [],
        isAuthenticated: false,
        error: null,
      }
    case 'SET_STUDENT_DATA':
      return {
        ...state,
        student: action.payload.student,
        committees: action.payload.committees,
        committee_positions: action.payload.committee_positions || [],
        role: action.payload.role,
        permissions: action.payload.permissions,
        isAuthenticated: true,
        error: null,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }

    case 'SET_STALE':
      return {
        ...state,
        stale: action.payload,
      }

    default:
      return state
  }
}
