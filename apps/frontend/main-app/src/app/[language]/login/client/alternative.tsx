'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'

import type { LanguageCode } from '@/models/Language'
import Image from 'next/image'
import type { JSX } from 'react'

interface Props {
  language: LanguageCode
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
  language,
  return_url,
  remember,
}: Props): JSX.Element {
  const { t } = useTranslation(language, 'login')

  const loginKTH = () => {
    const redirectURL =
      process.env.NODE_ENV === 'production'
        ? `https://api.medieteknik.com/api/v1/auth?remember=${remember}${
            return_url ? `&return_url=${return_url}` : ''
          }`
        : `http://localhost:80/api/v1/auth?remember=${remember}${
            return_url ? `&return_url=${return_url}` : ''
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
            title={t('kth_login')}
            aria-label={t('kth_login')}
            variant={'ghost'}
            size={'icon'}
            onClick={loginKTH}
          >
            <Image
              src='https://storage.googleapis.com/medieteknik-static/static/logos/kth.svg'
              alt={t('kth_login')}
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
