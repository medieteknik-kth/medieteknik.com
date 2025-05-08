import type { AccountBankInformation } from '@/models/AccountBankInformation'
import type { SuccessfulRGBankAuthenticationResponse } from '@/models/response/AuthenticationResponse'
import type { AuthenticationAction } from '@medieteknik/authentication/src'
import type {
  AuthorResource,
  Committee,
  CommitteePosition,
  Permission,
  Role,
  Student,
} from '@medieteknik/models'

export interface AuthenticationState {
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
   * RGBank permissions
   */
  rgbank_permissions?: {
    access_level: number
    view_permission_level: number
  }

  /**
   * The bank account information of the student.
   */
  rgbank_bank_account?: AccountBankInformation

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
  logout: () => Promise<void>
  setStale: (stale: boolean) => void
}

export type RGBankAuthenticationAction =
  AuthenticationAction<SuccessfulRGBankAuthenticationResponse>

export const initialState: AuthenticationState = {
  student: null,
  isAuthenticated: false,
  role: 'OTHER',
  permissions: {
    author: [],
    student: [],
  },
  rgbank_permissions: {
    access_level: 0,
    view_permission_level: 0,
  },
  rgbank_bank_account: undefined,
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
  action: RGBankAuthenticationAction
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
        rgbank_permissions: {
          access_level: 0,
          view_permission_level: 0,
        },
        rgbank_bank_account: undefined,
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
        rgbank_permissions: action.payload.rgbank_permissions,
        rgbank_bank_account: action.payload.rgbank_bank_account,
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
