'use client'

import { Button } from '@/components/ui/button'
import type { LanguageCode } from '@/models/Language'
import { usePermissions } from '@/providers/AuthenticationProvider'
import { canViewExpenses } from '@/utility/expense/admin'
import { Link } from 'next-view-transitions'

interface Props {
  language: LanguageCode
}

export default function AdminButton({ language }: Props) {
  const { rgbank_permissions } = usePermissions()

  if (!canViewExpenses(rgbank_permissions)) {
    return null
  }

  return (
    <Button variant={'ghost'} asChild className='uppercase h-full bg-inherit'>
      <Link href={`/${language}/admin`}>Admin</Link>
    </Button>
  )
}
