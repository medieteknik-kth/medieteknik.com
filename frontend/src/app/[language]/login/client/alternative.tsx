'use client'

import KTHSVG from 'public/images/svg/kth.svg'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'

import { LanguageCode } from '@/models/Language'
import type { JSX } from 'react'

interface Props {
  language: LanguageCode
  return_url?: string | null
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
}: Props): JSX.Element {
  const { t } = useTranslation(language, 'login')

  const loginKTH = () => {
    const redirectURL =
      process.env.NODE_ENV === 'production'
        ? `https://api.medieteknik.com/auth${
            return_url && `?return_url=${return_url}`
          }`
        : `http://localhost:8080/auth${
            return_url && `?return_url=${return_url}`
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
            <KTHSVG
              width={80}
              height={80}
              aria-label='KTH Logo'
              name='KTH Logo'
              className='rounded-lg'
            />
          </Button>
        </li>
      </ul>
    </div>
  )
}
