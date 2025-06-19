/**
 * This file contains all the client providers that are used in the application.
 */
'use client'

import { authService } from '@/api/services/authenticationService'
import { AuthenticationContext } from '@/context/AuthContext'
import { NotificationProvider } from '@/context/NotificationContext'
import {
  type AppAuthenticationAction,
  type AuthenticationState,
  authenticationReducer,
  initialState,
} from '@/context/authReducer'
import type { LanguageCode } from '@/models/Language'
import { LOCAL_STORAGE_THEME } from '@/utility/LocalStorage'
import { AuthenticationProvider } from '@medieteknik/authentication/src'
import type { SuccessfulAuthenticationResponse } from '@medieteknik/models'
import { ThemeProvider } from 'next-themes'
import { type JSX, useCallback, useEffect, useState } from 'react'

interface Props {
  language: LanguageCode
  children: React.ReactNode
}

/**
 * A React component that provides all the client providers for the application.
 *
 * @param {string} language - The current language of the page.
 * @return {JSX.Element | null} The rendered component or null if not on the client.
 */
export default function ClientProviders({
  language,
  children,
}: Props): JSX.Element | null {
  const [isClient, setIsClient] = useState(false)
  const [standardTheme, setStandardTheme] = useState('light')

  const setTheme = useCallback((theme: string) => {
    window.localStorage.setItem(LOCAL_STORAGE_THEME, theme)
    setStandardTheme(theme)
  }, [])

  useEffect(() => {
    const getTheme = () => {
      return window.localStorage.getItem(LOCAL_STORAGE_THEME)
    }

    setIsClient(true)
    setTheme(getTheme() || 'light')
  }, [setTheme])

  if (!isClient) {
    return null
  }

  return (
    <AuthenticationProvider<
      SuccessfulAuthenticationResponse,
      AuthenticationState,
      AppAuthenticationAction
    >
      authService={authService}
      authenticationReducer={authenticationReducer}
      initialState={initialState}
      context={AuthenticationContext}
      language={language}
    >
      <NotificationProvider>
        <ThemeProvider
          attribute='class'
          defaultTheme={standardTheme}
          themes={['dark', 'light']}
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </NotificationProvider>
    </AuthenticationProvider>
  )
}
