'use client'

import { AuthenticationContext } from '@/context/AuthContext'
import type Committee from '@/models/Committee'
import type { CommitteePosition } from '@/models/Committee'
import type { AuthorResource } from '@/models/Items'
import type { Permission, Role } from '@/models/Permission'
import type Student from '@/models/Student'
import { useContext } from 'react'

/**
 * @interface authenticationContextData
 * @description The data returned by the `useAuthentication` hook
 * @property { boolean } isAuthenticated
 * @property { boolean } isLoading
 * @property { string | null } error
 * @property { (email: string, password: string, csrf_token: string, remember?: boolean) => Promise<boolean> } login
 * @property { () => void } logout
 * @property { (stale: boolean) => void } setStale
 * @property { boolean } stale
 * @see {@link useAuthentication}
 */
interface authenticationContextData {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (
    email: string,
    password: string,
    csrf_token: string,
    remember?: boolean
  ) => Promise<boolean>
  logout: () => void
  setStale: (stale: boolean) => void
  stale: boolean
}

/**
 * @name useAuthentication
 * @description A hook to access the authentication context, such as `isAuthenticated` state and helper auth functions like `login` and `logout`
 * @returns { Object } authenticationContextData
 * @throws { Error } if used outside of `AuthenticationProvider` or if used in a server component
 * @see {@link authenticationContextData}
 * @example
 * 'use client'
 *
 * import { useAuthentication } from '@/providers/AuthenticationProvider'
 *
 * function Example() {
 *    const { isAuthenticated, login, logout } = useAuthentication()
 * }
 */
export function useAuthentication(): authenticationContextData {
  const context = useContext(AuthenticationContext)

  if (!context) {
    throw new Error(
      '`useAuthentication` must be used within an `AuthenticationProvider`'
    )
  }

  const { isAuthenticated, isLoading, error, login, logout, setStale, stale } =
    context

  return { isAuthenticated, isLoading, error, login, logout, setStale, stale }
}

/**
 * @interface permissionsContextData
 * @description The data returned by the `usePermissions` hook
 * @property { permissions: { student?: Permission[]; author?: AuthorResource[] } }
 * @property { hasPermission: (permission: Permission) => boolean }
 * @property { canAuthor: (resourceType: AuthorResource) => boolean }
 * @see {@link usePermissions}
 */
interface permissionsContextData {
  permissions: {
    student?: Permission[]
    author?: AuthorResource[]
  }
  hasPermission: (permission: Permission) => boolean
  canAuthor: (resourceType: AuthorResource) => boolean
}

/**
 * @name usePermissions
 * @description A hook to access the permissions context and helper functions relating to user permissions
 * @returns { Object } permissionsContextData
 * @throws { Error } if used outside of `AuthenticationProvider` or if used in a server component
 * @see {@link permissionsContextData}
 * @example
 * 'use client'
 *
 * import { usePermissions } from '@/providers/AuthenticationProvider'
 *
 * function Example() {
 *   const { hasPermission, canAuthor } = usePermissions()
 *   const canView = hasPermission('CALENDAR_PRIVATE')
 *   const canCreate = canAuthor('NEWS')
 * }
 */
export function usePermissions(): permissionsContextData {
  const context = useContext(AuthenticationContext)

  if (!context) {
    throw new Error(
      '`usePermissions` must be used within an `AuthenticationProvider`'
    )
  }

  const { permissions } = context

  function hasPermission(permission: Permission) {
    return permissions.student?.includes(permission) || false
  }

  function canAuthor(resourceType: AuthorResource) {
    return permissions.author?.includes(resourceType) || false
  }

  return { permissions, hasPermission, canAuthor }
}

/**
 * @interface studentContextData
 * @description The data returned by the `useStudent` hook
 * @property { Student | null } student
 * @property { Role } role
 * @property { Committee[] } committees
 * @property { CommitteePosition[] } positions
 * @see {@link useStudent}
 */
interface studentContextData {
  student: Student | null
  role: Role
  committees: Committee[]
  positions: CommitteePosition[]
}

/**
 * @name useStudent
 * @description A hook to access the student context, such as `student` state and helper functions
 * @returns { Object } studentContextData
 * @throws { Error } if used outside of `AuthenticationProvider` or if used in a server component
 * @see {@link studentContextData}
 * @example
 * 'use client'
 *
 * import { useStudent } from '@/providers/AuthenticationProvider'
 *
 * function Example() {
 *   const { student, role, committees, positions } = useStudent()
 * }
 */
export function useStudent(): studentContextData {
  const context = useContext(AuthenticationContext)

  if (!context) {
    throw new Error(
      '`useStudent` must be used within an `AuthenticationProvider`'
    )
  }

  const { student, role, committees, positions } = context

  return { student, role, committees, positions }
}
