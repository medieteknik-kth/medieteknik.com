'use client'

import PDFWorkerInitializer from '@/components/client/PDFWorker'
import { AuthenticationProvider } from '@/context/AuthenticationContext'
import type { LanguageCode } from '@/models/Language'
import type { JSX } from 'react'

interface Props {
  language: LanguageCode
  children: React.ReactNode
}

/**
 * @name ClientWrapper
 * @description This component is a wrapper for client-side components, used in the layout of the application.
 *  * PDFWorkerInitializer component ensures that the PDF.js worker is initialized correctly in a client-side context.
 * @param {React.ReactNode} children - The child components to be rendered within this component.
 * @returns {JSX.Element} - Returns the child components wrapped in a React fragment.
 */
export default function ClientWrapper({
  language,
  children,
}: Props): JSX.Element {
  return (
    <>
      <PDFWorkerInitializer>
        <AuthenticationProvider language={language}>
          {children}
        </AuthenticationProvider>
      </PDFWorkerInitializer>
    </>
  )
}
