'use client'
import { ThemeProvider } from 'next-themes'
import { useState, useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='light'
      themes={['dark', 'light']}
    >
      {children}
    </ThemeProvider>
  )
}
