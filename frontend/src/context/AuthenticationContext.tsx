'use client'

import { authService } from '@/api/services/authenticationService'
import {
  type AuthenticationContextType,
  authenticationReducer,
  initialState,
} from '@/context/authReducer'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import type { AuthenticationResponse } from '@/models/response/AuthenticationResponse'
import type { JSX } from 'react'
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'

const SESSION_DURATION_MS = 15 * 60 * 1000
const AUTH_TIMEOUT_INTERVAL_MS = 60 * 1000

interface Props {
  language: LanguageCode
  children: React.ReactNode
}

function getUniqueCommittees(json: AuthenticationResponse) {
  return (
    (json.committees &&
      Array.from(new Set(json.committees.map((c) => c.committee_id)))
        .map((id) => {
          if (!json.committees) return null
          return json.committees.find((c) => c.committee_id === id)
        })
        .filter((c): c is Committee => c !== null && c !== undefined)) ||
    []
  )
}

export const AuthenticationContext = createContext<
  AuthenticationContextType | undefined
>(undefined)

export function AuthenticationProvider({
  language,
  children,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(authenticationReducer, initialState)
  const [jwtTokenExpiration, setJwtTokenExpirationChecked] = useState<number>(0)
  const jwtExpirationRef = useRef(jwtTokenExpiration)

  const login = useCallback(
    async (
      email: string,
      password: string,
      csrf_token: string,
      remember?: boolean
    ) => {
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        const result = await authService.login(
          email,
          password,
          csrf_token,
          remember
        )
        if (result) {
          dispatch({ type: 'LOGIN' })
          dispatch({ type: 'SET_STALE', payload: true })
          return true
        }
        return result
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Invalid credentials' })
        return false
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },
    []
  )

  const logout = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      await authService.logout()
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to logout' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const checkUserData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const json = await authService.getUserData(language)

      setJwtTokenExpirationChecked(json.expiration)
      dispatch({
        type: 'SET_STUDENT_DATA',
        payload: {
          student: json.student,
          committees: getUniqueCommittees(json),
          positions: json.committee_positions || [],
          role: json.role || 'OTHER',
          permissions: json.permissions || {
            author: [],
            student: [],
          },
        },
      })
      dispatch({ type: 'SET_STALE', payload: false })
      dispatch({ type: 'LOGIN' })
    } catch (error: unknown) {
      dispatch({ type: 'LOGOUT' })
      if (error instanceof TypeError) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Network error, please check your connection',
        })
      } else if (
        error instanceof Error &&
        'response' in error &&
        (error as { response: { status: number } }).response?.status === 401
      ) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Session expired, please login again',
        })
      } else {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to authenticate. Please try again.',
        })
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [language])

  useEffect(() => {
    jwtExpirationRef.current = jwtTokenExpiration
  }, [jwtTokenExpiration])

  useEffect(() => {
    if (!state.student || state.stale) {
      checkUserData()
    }

    const interval = setInterval(() => {
      if (!state.student) {
        return
      }

      if (jwtExpirationRef.current * 1000 - Date.now() <= SESSION_DURATION_MS) {
        checkUserData()
      }
    }, AUTH_TIMEOUT_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [state.stale, state.student, checkUserData])

  const contextValue = useMemo(() => {
    return {
      ...state,

      login,
      logout,

      /**
       * Manually updates the stale status of the user data, i.e. user has changed their account settings and need to refresh the data.
       *
       * @param {boolean} stale - The stale status to be set. True if the data is stale (recently updated), false otherwise.
       * @returns {void}
       */
      setStale: (stale: boolean): void =>
        dispatch({ type: 'SET_STALE', payload: stale }),
    }
  }, [state, login, logout])

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  )
}
