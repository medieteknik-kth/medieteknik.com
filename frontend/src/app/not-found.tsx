import Link from 'next/link'
import './error.css'

import Image from 'next/image'
import type { JSX } from 'react'

/**
 * @name NotFound
 * @description The 404 page
 *
 * @returns {JSX.Element} The 404 page
 */
export default async function NotFound(): Promise<JSX.Element> {
  return (
    <main aria-label='Page not found'>
      <Image
        src='https://storage.googleapis.com/medieteknik-static/static/light_logobig.webp'
        alt='logo'
        aria-label='logo'
        width={200}
        height={200}
      />
      <div>
        <h1>404 - Page Not Found</h1>

        <h2>
          Go back to the <Link href='/'>homepage</Link>.
        </h2>
        <p>
          If you believe this to be an error, please mail us at{' '}
          <Link href='mailto:webmaster@medieteknik.com'>
            webmaster@medieteknik.com
          </Link>
        </p>
      </div>
    </main>
  )
}
