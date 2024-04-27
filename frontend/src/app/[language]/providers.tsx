'use client'
import { ThemeProvider } from 'next-themes'
import { useState, useEffect } from 'react'
import { ClientCookieConsent, CookieConsent } from '@/utility/CookieManager'
import { useCookies } from 'next-client-cookies'

export function Providers({ children }: { children: React.ReactNode }) {
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
    <ThemeProvider
      attribute='class'
      defaultTheme={standardTheme}
      themes={['dark', 'light']}
      enableSystem={true}
    >
      {children}
    </ThemeProvider>
  )
}
