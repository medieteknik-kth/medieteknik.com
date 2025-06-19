'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import type { JSX } from 'react'

interface Props {
  return_url?: string | null
  remember?: boolean
}

/**
 * @name AlternativeLogin
 * @description The alternative login methods
 *
 * @param {Props} props
 * @param {string} props.language - The language code
 *
 * @returns {JSX.Element} The alternative login methods
 */
export default function AlternativeLogin({
  return_url,
  remember,
}: Props): JSX.Element {
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('return_url') || return_url || null

  const loginKTH = () => {
    const redirectURL =
      process.env.NODE_ENV === 'production'
        ? `https://api.medieteknik.com/api/v1/auth?filter=rgbank&remember=${remember}${
            returnUrl ? `&return_url=${returnUrl}` : ''
          }`
        : `http://localhost:80/api/v1/auth?filter=rgbank&remember=${remember}${
            returnUrl ? `&return_url=${returnUrl}` : ''
          }`
    window.location.href = `${redirectURL}`
  }

  return (
    <div
      className='w-full flex flex-col items-center'
      style={{
        fontSize: 'inherit',
      }}
    >
      <ul className='w-full grid grid-cols-1 place-items-center'>
        <li className='text-center'>
          <Button
            className='w-full h-full'
            title='KTH Login'
            aria-label='KTH Login'
            variant={'ghost'}
            size={'icon'}
            onClick={loginKTH}
          >
            <Image
              src='https://storage.googleapis.com/medieteknik-static/static/logos/kth.svg'
              alt='KTH Logo'
              width={80}
              height={80}
              unoptimized
            />
          </Button>
        </li>
      </ul>
    </div>
  )
}
