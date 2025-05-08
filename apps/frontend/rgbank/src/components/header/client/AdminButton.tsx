'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import { usePermissions } from '@/providers/AuthenticationProvider'
import { canViewExpenses } from '@/utility/expense/admin'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { Link } from 'next-view-transitions'

interface Props {
  language: LanguageCode
}

export default function AdminButton({ language }: Props) {
  const { rgbank_permissions } = usePermissions()
  const { t } = useTranslation(language, 'header')

  if (!canViewExpenses(rgbank_permissions)) {
    return null
  }

  return (
    <Button variant={'ghost'} asChild className='uppercase h-full bg-inherit'>
      <Link href={`/${language}/admin`} title={t('nav.admin')}>
        {t('nav.admin')}
      </Link>
    </Button>
  )
}
