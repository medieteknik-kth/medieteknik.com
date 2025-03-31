import { AuthenticationProvider } from '@/context/AuthenticationContext'
import type { LanguageCode } from '@/models/Language'
import type { JSX } from 'react'

interface Props {
  language: LanguageCode
  children: React.ReactNode
}

export default function Providers({ language, children }: Props): JSX.Element {
  return (
    <>
      <AuthenticationProvider language={language}>
        {children}
      </AuthenticationProvider>
    </>
  )
}
