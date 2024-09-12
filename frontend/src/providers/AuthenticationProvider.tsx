'use client'
import Committee, { CommitteePosition } from '@/models/Committee'
import { AuthorResource } from '@/models/Items'
import { Role, Permission } from '@/models/Permission'
import Student from '@/models/Student'
import { API_BASE_URL } from '@/utility/Constants'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'

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
  positions: CommitteePosition[]

  /**
   * The error message if any error occurs during authentication.
   */
  error: string | null

  /**
   * The loading status of the authentication.
   */
  isLoading: boolean
}

type AuthenticationAction =
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER' }
  | { type: 'REFRESH_TOKEN' }
  | { type: 'SET_STUDENT'; payload: Student }
  | { type: 'SET_ROLE'; payload: Role }
  | {
      type: 'SET_PERMISSIONS'
      payload: {
        author: AuthorResource[]
        student: Permission[]
      }
    }
  | { type: 'SET_COMMITTEES'; payload: Committee[] }
  | { type: 'SET_POSITIONS'; payload: CommitteePosition[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }

interface AuthenticationResponse {
  student: Student
  role: Role
  permissions: {
    author: AuthorResource[]
    student: Permission[]
  }
  committees: Committee[]
  positions: CommitteePosition[]
}

/**
 * Reducer function for handling authentication state changes based on the given action type.
 *
 * @param {AuthenticationState} state - The current state of the authentication.
 * @param {AuthenticationAction} action - The action to be performed on the authentication state.
 * @returns {AuthenticationState} The updated authentication state after applying the action.
 */
function authenticationReducer(
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
        positions: [],
        isAuthenticated: false,
        error: null,
      }

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        error: null,
      }

    case 'REFRESH_TOKEN':
      return {
        ...state,
        isAuthenticated: true,
        error: null,
      }

    case 'SET_STUDENT':
      return {
        ...state,
        student: action.payload,
      }

    case 'SET_ROLE':
      return {
        ...state,
        role: action.payload,
      }

    case 'SET_PERMISSIONS':
      return {
        ...state,
        permissions: action.payload,
      }

    case 'SET_COMMITTEES':
      return {
        ...state,
        committees: action.payload,
      }

    case 'SET_POSITIONS':
      return {
        ...state,
        positions: action.payload,
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

    default:
      return state
  }
}

const initialState: AuthenticationState = {
  student: null,
  isAuthenticated: false,
  role: 'OTHER',
  permissions: {
    author: [],
    student: [],
  },
  committees: [],
  positions: [],
  error: null,
  isLoading: true,
}

interface AuthenticationContextType extends AuthenticationState {
  login: (
    email: string,
    password: string,
    csrf_token: string
  ) => Promise<boolean>
  logout: () => void
  register: () => void
  setStudent: (student: Student) => void
}

const AuthenticationContext = createContext<
  AuthenticationContextType | undefined
>(undefined)

interface Props {
  language: string
  children: React.ReactNode
}

/**
 * Creates an object with authentication functions.
 *
 * @param {React.Dispatch<AuthenticationAction>} dispatch - The dispatch function from the Redux store.
 * @return {Object} An object with authentication functions.
 * @property {Function} login - Asynchronously logs in the user by making a POST request to the server.
 * @property {Function} logout - Asynchronously logs out the user by making a POST request to the server.
 * @property {Function} refreshToken - Asynchronously refreshes the JWT Token by making a POST request to the server.
 */
const createAuthFunctions = (
  dispatch: React.Dispatch<AuthenticationAction>
) => ({
  /**
   * Login function that makes a POST request to the server to login the user.
   * @async
   *
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @param {string} csrf_token - The CSRF token of the user.
   *
   * @returns {Promise<void>}
   */
  login: async (
    email: string,
    password: string,
    csrf_token: string
  ): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const json_data = {
        email: email,
        password: password,
        csrf_token: csrf_token,
      }
      const response = await fetch(`${API_BASE_URL}/students/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify(json_data),
      })

      if (response.ok) {
        const json = (await response.json()) as AuthenticationResponse
        dispatch({ type: 'SET_STUDENT', payload: json.student })
        dispatch({ type: 'SET_ROLE', payload: json.role })
        dispatch({ type: 'SET_PERMISSIONS', payload: json.permissions })
        dispatch({ type: 'SET_COMMITTEES', payload: json.committees })
        dispatch({ type: 'SET_POSITIONS', payload: json.positions })
        dispatch({ type: 'LOGIN' })
        return true
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Invalid Crendentials' })
        return false
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Invalid Crendentials' })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  },
  /**
   * Logout function that makes a POST request to the server to logout the user.
   * @async
   *
   * @returns {Promise<void>}
   */
  logout: async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await fetch(`${API_BASE_URL}/students/logout`, {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        dispatch({ type: 'LOGOUT' })
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Something went wrong! Please try again',
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  },
  /**
   * Refresh token function that makes a POST request to the server to refresh the JWT Token.
   * @async
   *
   * @returns {Promise<void>}
   */
  refreshToken: async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await fetch(`${API_BASE_URL}/students/refresh`, {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        const json = (await response.json()) as AuthenticationResponse
        dispatch({ type: 'SET_STUDENT', payload: json.student })
        dispatch({ type: 'SET_ROLE', payload: json.role })
        dispatch({ type: 'SET_PERMISSIONS', payload: json.permissions })
        dispatch({ type: 'SET_COMMITTEES', payload: json.committees })
        dispatch({ type: 'SET_POSITIONS', payload: json.positions })
      } else {
        dispatch({ type: 'LOGOUT' })
        throw new Error('Failed to refresh token')
      }
    } catch (error) {
      dispatch({ type: 'LOGOUT' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  },
})

/**
 * Creates an AuthenticationProvider component that handles authentication state and provides it to its children.
 *
 * @param {Props} props - The component props.
 * @param {string} props.language - The language of the application.
 * @param {React.ReactNode} props.children - The children components.
 * @return {JSX.Element} The AuthenticationProvider component.
 */
export function AuthenticationProvider({
  language,
  children,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(authenticationReducer, initialState)
  const authFunctions = useMemo(() => createAuthFunctions(dispatch), [])

  useEffect(() => {
    /**
     * Checks if the user is authenticated and updates the authentication state accordingly.
     * @async
     */
    const checkAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        const response = await fetch(
          `${API_BASE_URL}/students/me?language=${language}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        )

        if (response.ok) {
          const json: AuthenticationResponse = await response.json()
          dispatch({
            type: 'SET_STUDENT',
            payload: {
              ...json.student,
              author_type: 'STUDENT',
            },
          })
          dispatch({ type: 'SET_ROLE', payload: json.role })
          dispatch({ type: 'SET_PERMISSIONS', payload: json.permissions })
          dispatch({ type: 'SET_COMMITTEES', payload: json.committees })
          dispatch({ type: 'SET_POSITIONS', payload: json.positions })
          dispatch({ type: 'LOGIN' })
        } else {
          dispatch({ type: 'LOGOUT' })
        }
      } catch (error) {
        dispatch({ type: 'LOGOUT' })
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to authenticate. Please try again.',
        })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuth()
  }, [])

  const contextValue = useMemo(() => {
    return {
      ...state,
      register: () => dispatch({ type: 'REGISTER' }),

      /**
       * Sets the student in the authentication state, by dispatching the action to the reducer.
       *
       * @param {Student} student - The student object to be set.
       * @return {void}
       */
      setStudent: (student: Student): void =>
        dispatch({ type: 'SET_STUDENT', payload: student }),

      /**
       * Sets the current role in the authentication state, by dispatching the action to the reducer.
       *
       * @param {Role} role - The role to be set.
       * @returns {void}
       */
      setRole: (role: Role): void =>
        dispatch({ type: 'SET_ROLE', payload: role }),

      /**
       * Sets the permissions in the authentication state, by dispatching the action to the reducer.
       *
       * @param {AuthorResource[]} permissions.author - The author resources to be set.
       * @param {Permission[]} permissions.student - The student permissions to be set.
       * @returns {void}
       */
      setPermissions: (permissions: {
        author: AuthorResource[]
        student: Permission[]
      }): void => dispatch({ type: 'SET_PERMISSIONS', payload: permissions }),

      /**
       * Sets the committees in the authentication state, by dispatching the action to the reducer.
       *
       * @param {Committee[]} committees - The committees to be set.
       * @returns {void}
       */
      setCommittees: (committees: Committee[]): void =>
        dispatch({ type: 'SET_COMMITTEES', payload: committees }),

      /**
       * Sets the positions in the authentication state, by dispatching the action to the reducer.
       *
       * @param {CommitteePosition[]} positions - The positions to be set.
       * @returns {void}
       */
      setPositions: (positions: CommitteePosition[]): void =>
        dispatch({ type: 'SET_POSITIONS', payload: positions }),
    }
  }, [state])

  useEffect(() => {
    /**
     * Refreshes the access token every 30 minutes.
     */
    const refreshTimer = setInterval(() => {
      if (state.student) {
        dispatch({ type: 'REFRESH_TOKEN' })
        authFunctions.refreshToken()
      } else {
        clearInterval(refreshTimer)
      }
    }, 1000 * 60 * 30)

    return () => clearInterval(refreshTimer)
  }, [state, authFunctions])

  return (
    <AuthenticationContext.Provider
      value={{ ...contextValue, ...authFunctions }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}

/**
 * useAuthentication
 *
 * @description The hook for the Authentication component. Must be used on the client side.
 * @returns The context for the Authentication component.
 * @throws {TypeError} If the hook is used on the server side.
 */
export function useAuthentication() {
  const context = useContext(AuthenticationContext)
  if (!context) {
    throw new Error(
      '`useAuthentication` must be used within an `AuthenticationProvider`'
    )
  }
  return context
}
