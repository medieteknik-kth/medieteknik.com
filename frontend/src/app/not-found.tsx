import './error.css'

import type { JSX } from "react";

/**
 * @name NotFound
 * @description The 404 page
 *
 * @returns {JSX.Element} The 404 page
 */
export default async function NotFound(): Promise<JSX.Element> {
  return (
    <main aria-label='Page not found'>
      <img
        src='https://storage.googleapis.com/medieteknik-static/static/light_logobig.webp'
        alt='logo'
        aria-label='logo'
      />
      <div>
        <h1>404 - Page Not Found</h1>

        <h2>
          Go back to the <a href='/'>homepage</a>.
        </h2>
        <p>
          If you believe this to be an error, please mail us at{' '}
          <a href='mailto:webmaster@medieteknik.com'>
            webmaster@medieteknik.com
          </a>
        </p>
      </div>
    </main>
  )
}
