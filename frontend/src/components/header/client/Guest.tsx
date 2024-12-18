'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import { LanguageCode } from '@/models/Language'
import { UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { JSX } from 'react'

interface Props {
  language: LanguageCode
}

/**
 * @name Guest
 * @description Renders the display for guest or non-authenticated users
 *
 * @param {Props} props
 * @param {string} props.language - The current language of the page
 * 
 * @returns {JSX.Element} The guest display
 */
export default function Guest({ language }: Props): JSX.Element {
  const { t } = useTranslation(language, 'header')
  const pathname = usePathname()
  const loginUrl = `/${language}/login${
    pathname !== '/' ? `?return_url=${pathname}` : ''
  }`

  return (
    <Button
      variant={'ghost'}
      className='w-16 lg:w-fit rounded-none lg:mr-2'
      asChild
    >
      <Link
        href={loginUrl}
        className='w-16 lg:w-full h-full flex justify-center xl:justify-end items-center'
        title={t('login')}
        aria-label={t('login')}
      >
        <p className='text-sm hidden flex-col items-end mr-4 uppercase xl:flex'>
          {t('login')}
        </p>
        <UserIcon className='w-7 h-7' />
      </Link>
    </Button>
  )
}
