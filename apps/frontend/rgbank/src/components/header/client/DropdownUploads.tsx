'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useAuthentication,
  usePermissions,
} from '@/providers/AuthenticationProvider'
import { canViewExpenses } from '@/utility/expense/admin'
import {
  FolderOpenIcon,
  InboxIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { Link } from 'next-view-transitions'

interface Props {
  language: LanguageCode
}

export default function DropdownUploads({ language }: Props) {
  const { isAuthenticated } = useAuthentication()
  const { rgbank_permissions } = usePermissions()
  const { t } = useTranslation(language, 'header')

  if (!isAuthenticated) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'ghost'}
          size='icon'
          className='relative md:hidden flex w-full h-full items-center justify-center'
        >
          <InboxIcon className='w-7 h-7' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`grid gap-2 ${canViewExpenses(rgbank_permissions) ? 'grid-cols-2' : 'grid-cols-1'}`}
      >
        {canViewExpenses(rgbank_permissions) && (
          <DropdownMenuItem asChild>
            <Link
              href={`/${language}/upload?template=expense`}
              className='w-32 h-24 cursor-pointer flex flex-col gap-2 justify-center'
            >
              <ShieldExclamationIcon className='w-7 h-7' />
              <p>{t('nav.admin')}</p>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link
            href={`/${language}/upload?template=invoice`}
            className='w-32 h-24 cursor-pointer flex flex-col gap-2 justify-center text-center'
          >
            <FolderOpenIcon className='w-7 h-7' />
            <p>{t('nav.uploads')}</p>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
