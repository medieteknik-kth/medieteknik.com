'use client'

import PDFWorkerInitializer from '@/components/client/PDFWorker'
import type { JSX } from 'react'

interface Props {
  children: React.ReactNode
}

/**
 * @name ClientWrapper
 * @description This component is a wrapper for client-side components, used in the layout of the application.
 *  * PDFWorkerInitializer component ensures that the PDF.js worker is initialized correctly in a client-side context.
 * @param {React.ReactNode} children - The child components to be rendered within this component.
 * @returns {JSX.Element} - Returns the child components wrapped in a React fragment.
 */
export default function ClientWrapper({ children }: Props): JSX.Element {
  return (
    <>
      <PDFWorkerInitializer>{children}</PDFWorkerInitializer>
    </>
  )
}
