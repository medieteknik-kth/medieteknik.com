'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { Link } from 'next-view-transitions'

interface Props {
  language: LanguageCode
}

export default function AuthenticatedNavigation({ language }: Props) {
  const { isAuthenticated } = useAuthentication()
  const { t } = useTranslation(language, 'header')

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Button variant={'ghost'} asChild className='uppercase h-full bg-inherit'>
        <Link
          href={`/${language}/upload?template=expense`}
          title={t('nav.expense')}
        >
          {t('nav.expense')}
        </Link>
      </Button>

      <Button variant={'ghost'} asChild className='uppercase h-full bg-inherit'>
        <Link
          href={`/${language}/upload?template=invoice`}
          title={t('nav.invoice')}
        >
          {t('nav.invoice')}
        </Link>
      </Button>

      <Button variant='ghost' asChild className='uppercase h-full bg-inherit'>
        <Link
          href={`/${language}/account?category=activity`}
          title={t('nav.uploads')}
        >
          {t('nav.uploads')}
        </Link>
      </Button>
    </>
  )
}
