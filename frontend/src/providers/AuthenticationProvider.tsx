'use client'
import Committee, { CommitteePosition } from '@/models/Committee'
import { AuthorResource } from '@/models/Items'
import Student from '@/models/Student'
import { API_BASE_URL } from '@/utility/Constants'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'

type Role = 'ADMIN' | 'COMMITTEE_MEMBER' | 'STUDENT' | 'OTHER'
type Permissions =
  | 'STUDENT_EDIT_PERMISSIONS'
  | 'STUDENT_ADD'
  | 'STUDENT_DELETE'
  | 'STUDENT_EDIT'
  | 'STUDENT_VIEW'
  | 'COMMITTEE_EDIT_PERMISSIONS'
  | 'COMMITTEE_ADD'
  | 'COMMITTEE_DELETE'
  | 'COMMITTEE_EDIT'
  | 'COMMITTEE_ADD_MEMBER'
  | 'COMMITTEE_REMOVE_MEMBER'
  | 'COMMITTEE_EDIT_MEMBER'
  | 'COMMITTEE_POSITION_EDIT_PERMISSIONS'
  | 'COMMITTEE_POSITION_ADD'
  | 'COMMITTEE_POSITION_DELETE'
  | 'COMMITTEE_POSITION_EDIT'
  | 'ITEMS_EDIT'
  | 'ITEMS_DELETE'
  | 'CALENDAR_PRIVATE'
  | 'CALENDAR_CREATE'
  | 'CALENDAR_DELETE'
  | 'CALENDAR_EDIT'

interface AuthenticationState {
  student: Student | null
  isAuthenticated: boolean
  role: Role
  permissions: {
    author: AuthorResource[]
    student: Permissions[]
  }
  committees: Committee[]
  positions: CommitteePosition[]
  error: string | null
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
        student: Permissions[]
      }
    }
  | { type: 'SET_COMMITTEES'; payload: Committee[] }
  | { type: 'SET_POSITIONS'; payload: CommitteePosition[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }

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
        isLoading: false,
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
        isLoading: false,
      }

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      }

    case 'REFRESH_TOKEN':
      return {
        ...state,
        isAuthenticated: true,
        error: null,
        isLoading: false,
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
      }

    default:
      return state
  }
}

const initalState: AuthenticationState = {
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
  isLoading: false,
}

interface AuthenticationContextType extends AuthenticationState {
  login: (email: string, password: string, csrf_token: string) => void
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

export function AuthenticationProvider({ language, children }: Props) {
  const [state, dispatch] = useReducer(authenticationReducer, initalState)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        const response = await fetch(
          `${API_BASE_URL}/students/me?language=${language}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        )

        if (response.ok) {
          const json: {
            student: Student
            role: Role
            permissions: {
              author: AuthorResource[]
              student: Permissions[]
            }
            committees: Committee[]
            positions: CommitteePosition[]
          } = await response.json()
          dispatch({ type: 'SET_STUDENT', payload: json.student })
          dispatch({ type: 'SET_ROLE', payload: json.role })
          dispatch({ type: 'SET_PERMISSIONS', payload: json.permissions })
          dispatch({ type: 'SET_COMMITTEES', payload: json.committees })
          dispatch({ type: 'SET_POSITIONS', payload: json.positions })
          dispatch({ type: 'LOGIN' })
        } else {
          dispatch({ type: 'LOGOUT' })
        }
      } catch (error) {
        console.error(error)
        dispatch({ type: 'LOGOUT' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuth()
  }, [])

  const login = useMemo(
    () => async (email: string, password: string, csrf_token: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
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
          const json = await response.json()
          dispatch({ type: 'SET_STUDENT', payload: json })
          dispatch({ type: 'LOGIN' })
        } else {
          dispatch({ type: 'SET_ERROR', payload: 'Invalid Crendentials' })
        }
      } catch (error) {
        console.error(error)
        dispatch({ type: 'SET_ERROR', payload: 'Invalid Crendentials' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },
    []
  )

  const logout = useMemo(
    () => async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        const response = await fetch(`${API_BASE_URL}/students/logout`, {
          method: 'POST',
          credentials: 'include',
        })

        if (response.ok) {
          dispatch({ type: 'LOGOUT' })
        }
      } catch (error) {
        console.error(error)
        dispatch({
          type: 'SET_ERROR',
          payload: 'Something went wrong! Please try again',
        })
      }
    },
    []
  )

  const refreshToken = useMemo(
    () => async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        const response = await fetch(`${API_BASE_URL}/students/refresh`, {
          method: 'POST',
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Session Expired')
        }
      } catch (error) {
        console.error(error)
        dispatch({ type: 'LOGOUT' })
      }
    },
    []
  )

  const contextValue = useMemo(() => {
    return {
      ...state,
      login,
      logout,
      register: () => dispatch({ type: 'REGISTER' }),
      setStudent: (student: Student) =>
        dispatch({ type: 'SET_STUDENT', payload: student }),
    }
  }, [state])

  useEffect(() => {
    const refreshTimer = setInterval(() => {
      if (state.student) {
        refreshToken()
      } else {
        clearInterval(refreshTimer)
      }
    }, 1000 * 60 * 30)

    return () => clearInterval(refreshTimer)
  }, [state, refreshToken])

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  )
}

/**
 * useAuthentication
 *
 * @description The hook for the Authentication component.
 * @returns The context for the Authentication component.
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
