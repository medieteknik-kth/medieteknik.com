'use client';
import KTHSVG from 'public/images/svg/kth.svg'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'

import type { JSX } from "react";

interface Props {
  language: string
}

/**
 * @name AlternativeLogin
 * @description The alternative login methods
 *
 * @param {Props} props
 * @param {string} props.language - The language code
 * @returns {JSX.Element} The alternative login methods
 */
export default function AlternativeLogin({ language }: Props): JSX.Element {
  const { t } = useTranslation(language, 'login')

  const loginKTH = () => {
    const redirectURL =
      process.env.NODE_ENV === 'production'
        ? 'https://api.medieteknik.com/auth'
        : 'http://localhost:3000/auth'
    window.location.href = `${redirectURL}`
  }

  return (
    <div className='w-full xs:min-w-[300px] md:min-w-[600px] flex flex-col items-center'>
      <h2 className='w-full text-lg md:text-2xl text-center uppercase tracking-wider py-8'>
        {t('alternative_logins')}
      </h2>

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
            />
          </Button>
        </li>
      </ul>
    </div>
  )
}
