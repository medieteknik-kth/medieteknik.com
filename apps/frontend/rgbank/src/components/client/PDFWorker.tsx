'use client'

import * as pdfjsLib from 'pdfjs-dist'
import { type JSX, useEffect } from 'react'

interface Props {
  children: React.ReactNode
}

/**
 * @name PDFWorkerInitializer
 * @description This component initializes the PDF.js worker when the component is mounted. It sets the worker source URL and handles any errors that may occur during the loading process.
 * It is important to use this component in a client-side context, as the worker cannot be loaded on the server side.
 * @param {React.ReactNode} children - The child components to be rendered within this component.
 * @returns {JSX.Element} - Returns the child components wrapped in a React fragment.
 * @see https://mozilla.github.io/pdf.js/getting_started/
 */
export default function PDFWorkerInitializer({ children }: Props): JSX.Element {
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.mjs',
        import.meta.url
      ).toString()

      console.log('PDF worker source:', workerSrc)

      pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc
      console.log('PDF worker loaded successfully')
    } catch (error) {
      console.error('Error loading PDF worker:', error)
    }
  }, [])

  return <>{children}</>
}
