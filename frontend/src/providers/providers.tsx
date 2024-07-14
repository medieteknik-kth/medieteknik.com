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

export default function Providers({ language, children }: Props) {
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
