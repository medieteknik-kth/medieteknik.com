import type { AuthenticationContextType } from '@/context/authReducer'
import { createContext } from 'react'

export const AuthenticationContext = createContext<
  AuthenticationContextType | undefined
>(undefined)
