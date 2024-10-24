/**
 * This file contains all the client providers that are used in the application.
 */
'use client'

import { LOCAL_STORAGE_THEME } from '@/utility/LocalStorage'
import { ThemeProvider } from 'next-themes'
import { useEffect, useState, type JSX } from 'react'
import { AuthenticationProvider } from './AuthenticationProvider'

interface Props {
  language: string
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

  const getTheme = () => {
    return window.localStorage.getItem(LOCAL_STORAGE_THEME)
  }

  const setTheme = (theme: string) => {
    window.localStorage.setItem(LOCAL_STORAGE_THEME, theme)
    setStandardTheme(theme)
  }

  useEffect(() => {
    setIsClient(true)
    setTheme(getTheme() || 'light')
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <AuthenticationProvider language={language}>
      <ThemeProvider
        attribute='class'
        defaultTheme={standardTheme}
        themes={['dark', 'light']}
        enableSystem={true}
      >
        {children}
      </ThemeProvider>
    </AuthenticationProvider>
  )
}
