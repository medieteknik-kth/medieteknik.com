'use client'

import { useTranslation } from '@/app/i18n/client'
import AppSwitcher from '@/components/header/components/AppSwitcher'
import DefaultProfile from '@/components/header/components/DefaultProfile'
import { ProfileButton } from '@/components/header/components/ProfileButton'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { IS_DEVELOPMENT, SITE_VERSION } from '@/utility/Constants'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import Link from 'next/link'
import { type JSX, useState } from 'react'

interface ProfileButtonProps {
  language: LanguageCode
}

export function WideScreenProfileButton({
  language,
}: ProfileButtonProps): JSX.Element {
  const { logout, isAuthenticated } = useAuthentication()
  const [open, setOpen] = useState(false)
  const { t } = useTranslation(language, 'profile')

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <ProfileButton />
      </DropdownMenuTrigger>
      {open && (
        <DropdownMenuContent className='w-72 lg:w-96 h-fit mr-5 dark:bg-[#111]'>
          <DefaultProfile language={language} />
          <DropdownMenuSeparator />
          <AppSwitcher language={language} />
          <DropdownMenuGroup>
            {isAuthenticated ? (
              <DropdownMenuItem>
                <Button
                  variant={'destructive'}
                  onClick={logout}
                  className='w-full'
                >
                  <ArrowRightStartOnRectangleIcon className='w-4 h-4 mr-2' />
                  {t('logout')}
                </Button>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem>
                <Button className='w-full' asChild>
                  <Link href={`/${language}`}>{t('login')}</Link>
                </Button>
              </DropdownMenuItem>
            )}
            <p className='w-full text-center text-muted-foreground text-xs py-2 select-none'>
              {t('rgbank')} v{SITE_VERSION}
              <span className='text-red-400 font-bold'>
                {IS_DEVELOPMENT ? ' DEV' : ''}
              </span>
            </p>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
