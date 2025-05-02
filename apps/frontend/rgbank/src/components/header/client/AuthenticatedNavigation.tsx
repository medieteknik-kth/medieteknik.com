'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import type { LanguageCode } from '@/models/Language'
import { useAuthentication } from '@/providers/AuthenticationProvider'
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
        <Link href={`/${language}/upload?template=expense`}>
          {t('nav.expense')}
        </Link>
      </Button>

      <Button variant={'ghost'} asChild className='uppercase h-full bg-inherit'>
        <Link href={`/${language}/upload?template=invoice`}>
          {t('nav.invoice')}
        </Link>
      </Button>

      <Button variant='ghost' asChild className='uppercase h-full bg-inherit'>
        <Link href={`/${language}/account?category=activity`}>
          {t('nav.uploads')}
        </Link>
      </Button>
    </>
  )
}
