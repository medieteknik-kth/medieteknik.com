import Link from 'next/link'

import type { JSX } from 'react'

/**
 * Renders the error fallback UI.
 * @name ErrorFallback
 * @description The fallback render for {@link ErrorBoundary}
 *
 * @returns {JSX.Element} The error fallback
 */
export default function ErrorFallback(): JSX.Element {
  return (
    <div className='h-screen grid place-items-center text-center'>
      <h1 className='text-3xl'>
        <span className='text-red-600'>Oops! </span>Something went wrong.
      </h1>
      <p className='text-lg'>
        We&apos;re sorry for the inconvenience. Please try refreshing the page
        or contact{' '}
        <Link
          href='mailto:webmaster@medieteknik.com'
          className='text-blue-600 underline underline-offset-4'
        >
          webmaster@medieteknik.com
        </Link>
      </p>
    </div>
  )
}
