'use client'

import type { LanguageCode } from '@medieteknik/models'

interface Props {
  language: LanguageCode
}

export function Loading({ language }: Props) {
  const title = language === 'en' ? 'Loading...' : 'Laddar...'

  return (
    <div className='w-full min-h-full h-screen flex items-center justify-center my-2 gap-2'>
      <svg
        name='loading'
        className='animate-spin motion-reduce:animate-none h-12 w-12 text-yellow-400 stroke-muted'
        viewBox='0 0 100 100'
        fill='currentColor'
      >
        <title>{title}</title>
        <path
          fill='none'
          stroke='inherit'
          strokeWidth='10'
          strokeLinecap='round'
          d='M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80'
        />
        <path
          fill='none'
          stroke='currentColor'
          strokeWidth='10'
          strokeLinecap='round'
          d='M50 10 a 40 40 0 0 1 40 40'
        />
      </svg>
      <p className='font-bold tracking-tight'>{title}</p>
    </div>
  )
}
