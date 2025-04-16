'use client'

import { Button } from '@/components/ui/button'
import type { LanguageCode } from '@/models/Language'
import { usePermissions } from '@/providers/AuthenticationProvider'
import { Link } from 'next-view-transitions'

interface Props {
  language: LanguageCode
}

export default function AdminButton({ language }: Props) {
  const { rgbank_permissions } = usePermissions()

  if (!rgbank_permissions) {
    return null
  }

  const { view_permission_level } = rgbank_permissions

  if (view_permission_level < 1) {
    return null
  }

  return (
    <Button variant={'ghost'} asChild className='uppercase h-full bg-inherit'>
      <Link href={`/${language}/admin`}>Admin</Link>
    </Button>
  )
}
