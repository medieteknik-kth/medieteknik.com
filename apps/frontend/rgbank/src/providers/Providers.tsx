'use client'

import { authService } from '@/api/services/authenticationService'
import { AuthenticationContext } from '@/context/AuthenticationContext'
import {
  type AuthenticationState,
  type RGBankAuthenticationAction,
  authenticationReducer,
  initialState
} from '@/context/authReducer'
import type { SuccessfulRGBankAuthenticationResponse } from '@/models/response/AuthenticationResponse'
import { LOCAL_STORAGE_THEME } from '@/utility/LocalStorage'
import { AuthenticationProvider } from '@medieteknik/authentication/src'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { ThemeProvider } from 'next-themes'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  language: LanguageCode
  children: React.ReactNode
}

export default function Providers({ language, children }: Props) {
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
    <>
      <AuthenticationProvider<
        SuccessfulRGBankAuthenticationResponse,
        AuthenticationState,
        RGBankAuthenticationAction
      >
        authService={authService}
        authenticationReducer={authenticationReducer}
        initialState={initialState}
        context={AuthenticationContext}
        language={language}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme={standardTheme}
          themes={['dark', 'light']}
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </AuthenticationProvider>
    </>
  )
}
