'use client'

import { AuthenticationContext } from '@/context/AuthenticationContext'
import type { AccountBankInformation } from '@/models/AccountBankInformation'
import type { RGBankPermissions } from '@/models/Permission'
import type {
  Committee,
  CommitteePosition,
} from '@medieteknik/models/src/committee'
import type { AuthorResource } from '@medieteknik/models/src/student/AuthorResource'
import type {
  Permission,
  Role,
} from '@medieteknik/models/src/student/Permission'
import type { Student } from '@medieteknik/models/src/student/Student'
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
 * @property { rgbank_permissions?: { access_level: number; view_permission_level: number } }
 * @property { hasPermission: (permission: Permission) => boolean }
 * @property { canAuthor: (resourceType: AuthorResource) => boolean }
 * @see {@link usePermissions}
 */
interface permissionsContextData {
  permissions: {
    student?: Permission[]
    author?: AuthorResource[]
  }
  rgbank_permissions?: RGBankPermissions
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

  const { permissions, rgbank_permissions } = context

  function hasPermission(permission: Permission) {
    return permissions.student?.includes(permission) || false
  }

  function canAuthor(resourceType: AuthorResource) {
    return permissions.author?.includes(resourceType) || false
  }

  return { permissions, rgbank_permissions, hasPermission, canAuthor }
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
  bank_account?: AccountBankInformation
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

  const {
    student,
    role,
    committees,
    committee_positions: positions,
    rgbank_bank_account: bank_account,
  } = context

  return { student, role, committees, positions, bank_account }
}
