'use client'

import type {
  AuthorResource,
  Committee,
  CommitteePosition,
  Permission,
  Role,
  Student,
} from '@medieteknik/models'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import type React from 'react'
import type { JSX } from 'react'
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'

/**
 * @constant {number} SESSION_DURATION_MS - The duration of the session in milliseconds.
 * @description The session duration is set to 15 minutes (15 * 60 * 1000 milliseconds).
 */
const SESSION_DURATION_MS = 15 * 60 * 1000

/**
 * @constant {number} AUTH_TIMEOUT_INTERVAL_MS - The interval for checking the authentication timeout in milliseconds.
 * @description The authentication timeout interval is set to 1 minute (60 * 1000 milliseconds).
 */
const AUTH_TIMEOUT_INTERVAL_MS = 60 * 1000

/**
 * @name StudentResponseData
 * @description The base shared interface for the student response data, you can extend this interface to add more properties if needed (per app).
 * @property {Student} student - The student object containing the student data.
 * @property {Committee[]} committees - The committees the student is a member of.
 * @property {CommitteePosition[]} committee_positions - The committee positions the student holds.
 * @property {Role} role - The role of the student.
 * @property {AuthorResource[]} permissions - The permissions of the student.
 * @property {number} expiration - The expiration time of the JWT token in seconds.
 */
interface StudentResponseData {
  /**
   * The student object containing the student data.
   */
  student: Student

  /**
   * The committees the student is a member of.
   */
  committees: Committee[]

  /**
   * The committee positions the student holds.
   */
  committee_positions: CommitteePosition[]

  /**
   * The role of the student.
   */
  role: Role

  /**
   * The permissions of the student.
   */
  permissions: {
    /**
     * The authorial rights of the student, i.e. what the student can do e.g. create news articles, etc.
     */
    author: AuthorResource[]

    /**
     * A fine-grained permission system for the student, i.e. what the student can do in the app.
     */
    student: Permission[]
  }

  /**
   * The expiration time of the JWT token in seconds.
   */
  expiration: number
}

/**
 * @name BaseAuthState
 * @description The base shared interface for the authentication state, you can extend this interface to add more properties if needed (per app).
 * @property {Student | null} student - The student object containing the student data or null if not authenticated.
 * @property {boolean} stale - A flag indicating whether the user data is stale or not.
 */
interface BaseAuthState {
  /**
   * The student object containing the student data or null if not authenticated.
   */
  student: Student | null

  /**
   * A flag indicating whether the user data is stale or not, used for when the user has changed their account settings and need to refresh the data.
   * Will force a re-fetch of the user data at the next interval.
   */
  stale: boolean
}

/**
 * @name AuthenticationAction
 * @description All shared actions for the authentication reducer, You can modify the student data type to be more specific if needed (per app).
 *
 * @property {type: 'LOGIN'} - Action type for login.
 * @property {type: 'LOGOUT'} - Action type for logout.
 * @property {type: 'SET_STUDENT_DATA', payload: T} - Action type for setting the student data.
 * @property {type: 'SET_LOADING', payload: boolean} - Action type for setting the loading state.
 * @property {type: 'SET_ERROR', payload: string} - Action type for setting the error state.
 * @property {type: 'SET_STALE', payload: boolean} - Action type for setting the stale state.
 * @template T - The type of the student response data.
 *
 * @see {@link StudentResponseData}
 */
export type AuthenticationAction<T extends StudentResponseData> =
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | {
      type: 'SET_STUDENT_DATA'
      payload: T
    }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_STALE'; payload: boolean }

interface AuthService<T extends StudentResponseData> {
  login: (
    email: string,
    password: string,
    csrf_token: string,
    remember?: boolean
  ) => Promise<Response>
  logout: () => Promise<void>
  getUserData: (language: LanguageCode) => Promise<{ error: string } | T>
}

type AuthContextValue<S extends BaseAuthState> = S & {
  login: (
    email: string,
    password: string,
    csrf_token: string,
    remember?: boolean
  ) => Promise<boolean>
  logout: () => Promise<void>
  setStale: (stale: boolean) => void
}

/**
 * @name AuthProviderProps
 * @description The props for the authentication provider component.
 * @property {LanguageCode} language - The language code for the authentication provider.
 * @property {function} authenticationReducer - The authentication reducer function.
 * @property {BaseAuthState} initialState - The initial state for the authentication provider.
 * @property {AuthService} authService - The authentication service for the authentication provider.
 * @property {React.Context} context - The authentication context for the authentication provider.
 * @property {React.ReactNode} children - The children components for the authentication provider.
 * @template T - The type of the student response data.
 * @template S - The type of the authentication state.
 * @template A - The type of the authentication action.
 */
interface AuthProviderProps<
  T extends StudentResponseData,
  S extends BaseAuthState,
  A extends AuthenticationAction<T>,
> {
  /**
   * The language code for the authentication provider.
   * @type {LanguageCode}
   */
  language: LanguageCode

  /**
   * @name authenticationReducer
   * @param {S} state - The current state of the authentication provider.
   * @param {A} action - The action to be performed on the state.
   * @returns {S} The new state of the authentication provider.
   */
  authenticationReducer: (state: S, action: A) => S

  /**
   * The initial state for the authentication provider.
   * @type {S}
   */
  initialState: S

  /**
   * The authentication service for the authentication provider.
   * @type {AuthService<T>}
   */
  authService: AuthService<T>

  /**
   * The authentication context for the authentication provider.
   * @type {React.Context<AuthContextValue<S> | undefined>}
   */
  context: React.Context<AuthContextValue<S> | undefined>

  /**
   * The children components for the authentication provider.
   */
  children: React.ReactNode
}

/**
 * @name AuthenticationProvider
 * @description The authentication provider component that provides the authentication context to the children components.
 * @param {AuthProviderProps} props - The props for the authentication provider.
 * @param {LanguageCode} props.language - The language code for the authentication provider.
 * @param {function} props.authenticationReducer - The authentication reducer function.
 * @param {BaseAuthState} props.initialState - The initial state for the authentication provider.
 * @param {AuthService} props.authService - The authentication service for the authentication provider.
 * @param {React.Context} props.context - The authentication context for the authentication provider.
 * @param {React.ReactNode} props.children - The children components for the authentication provider.
 * @template T - The type of the student response data.
 * @template S - The type of the authentication state.
 * @template A - The type of the authentication action.
 * @returns {JSX.Element} The authentication provider component.
 * @example
 * ```tsx
 * <AuthenticationProvider<SuccessfulAuthenticationResponse, AuthenticationState, AuthenticationAction>
 *    language={language}
 *    authService={authService}
 *    authenticationReducer={authenticationReducer}
 *    initialState={initialState}
 *    context={AuthenticationContext}>
 *      {children}
 * </AuthenticationProvider>
 * ```
 */
export function AuthenticationProvider<
  T extends StudentResponseData,
  S extends BaseAuthState,
  A extends AuthenticationAction<T>,
>({
  language,
  authenticationReducer,
  initialState,
  authService,
  context,
  children,
}: AuthProviderProps<T, S, A>): JSX.Element {
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
      dispatch({ type: 'SET_LOADING', payload: true } as A)
      try {
        const response = await authService.login(
          email,
          password,
          csrf_token,
          remember
        )
        if (!response.ok) {
          throw new Error('Invalid credentials')
        }

        const json = (await response.json()) as T
        dispatch({ type: 'LOGIN' } as A)
        dispatch({ type: 'SET_STUDENT_DATA', payload: json } as A)
        return true
      } catch {
        dispatch({ type: 'SET_ERROR', payload: 'Invalid credentials' } as A)
        return false
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false } as A)
      }
    },
    [authService]
  )

  const logout = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true } as A)
    try {
      await authService.logout()
      dispatch({ type: 'LOGOUT' } as A)
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to logout' } as A)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false } as A)
    }
  }, [authService])

  const checkUserData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true } as A)

    try {
      const json = await authService.getUserData(language)

      if ('error' in json) {
        dispatch({ type: 'LOGOUT' } as A)
        dispatch({
          type: 'SET_STALE',
          payload: false,
        } as A)
        dispatch({
          type: 'SET_ERROR',
          payload: json.error,
        } as A)
        return
      }

      setJwtTokenExpirationChecked(json.expiration)
      dispatch({
        type: 'SET_STUDENT_DATA',
        payload: json as T,
      } as A)
      dispatch({ type: 'SET_STALE', payload: false } as A)
      dispatch({ type: 'LOGIN' } as A)
    } catch (error: unknown) {
      dispatch({ type: 'LOGOUT' } as A)
      if (error instanceof TypeError) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Network error, please check your connection',
        } as A)
      } else if (
        error instanceof Error &&
        'response' in error &&
        (error as { response: { status: number } }).response?.status === 401
      ) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Session expired, please login again',
        } as A)
      } else {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to authenticate. Please try again.',
        } as A)
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false } as A)
    }
  }, [language, authService])

  useEffect(() => {
    jwtExpirationRef.current = jwtTokenExpiration
  }, [jwtTokenExpiration])

  useEffect(() => {
    // Updates the user data, if the user data is stale (i.e. the user has changed their account settings).
    // This is done via a setInterval that checks the expiration time of the JWT token.
    // If `checkUserData()` fails, the user is logged out and an error message is displayed.

    if (state.stale) {
      checkUserData()
    }

    const interval = setInterval(() => {
      if (!state.student) {
        return
      }

      if (jwtExpirationRef.current === 0) {
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
        dispatch({ type: 'SET_STALE', payload: stale } as A),
    }
  }, [state, login, logout])

  return <context.Provider value={contextValue}>{children}</context.Provider>
}
