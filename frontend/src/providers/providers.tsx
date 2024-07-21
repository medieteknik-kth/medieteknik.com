/**
 * This file contains all the client providers that are used in the application.
 */
'use client'
import { AuthenticationProvider } from './AuthenticationProvider'
import { ThemeProvider } from 'next-themes'
import { useState, useEffect } from 'react'
import { ClientCookieConsent, CookieConsent } from '@/utility/CookieManager'
import { useCookies } from 'next-client-cookies'

interface Props {
  language: string
  children: React.ReactNode
}

/**
 * A React component that provides all the client providers for the application.
 *
 * @param {Props} props - The component props.
 * @param {string} props.language - The current language of the page.
 * @param {React.ReactNode} props.children - The child components.
 * @return {JSX.Element | null} The rendered component or null if not on the client.
 */
export default function Providers({
  language,
  children,
}: Props): JSX.Element | null {
  const [isClient, setIsClient] = useState(false)
  const [standardTheme, setStandardTheme] = useState('light')
  const cookies = useCookies()

  useEffect(() => {
    setIsClient(true)
    const clientCookies = new ClientCookieConsent(window)
    if (clientCookies.isCategoryAllowed(CookieConsent.FUNCTIONAL)) {
      const storedTheme = cookies.get('theme') ?? 'light'
      setStandardTheme(storedTheme)
    }
  }, [cookies])

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
