'use client'

import { Button } from '@/components/ui/button'
import { Link } from 'next-view-transitions'
import type { JSX } from 'react'

/**
 * @name NotFound
 * @description The 404 page
 *
 * @returns {JSX.Element} The 404 page
 */
export default function NotFound(): JSX.Element {
  return (
    <main
      aria-label='Page not found'
      className='w-screen h-screen flex flex-col justify-center items-center gap-4'
    >
      <div className='flex flex-col items-center gap-2'>
        <h1 className='text-9xl font-bold select-none'>404</h1>
        <h2 className='text-2xl'>Page Not Found</h2>
      </div>
      <Button asChild>
        <Link href='/'>Go back to the homepage</Link>
      </Button>
      <div className='text-sm flex flex-col items-center'>
        <p>If you believe this to be an error, please mail us at</p>
        <a
          href='mailto:webmaster@medieteknik.com'
          className='text-blue-500 hover:underline'
        >
          webmaster@medieteknik.com
        </a>
      </div>
    </main>
  )
}
