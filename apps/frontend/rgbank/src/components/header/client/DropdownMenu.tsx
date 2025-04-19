'use client'

import DefaultProfile from '@/components/header/components/DefaultProfile'
import { ProfileButton } from '@/components/header/components/ProfileButton'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { LanguageCode } from '@/models/Language'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { IS_DEVELOPMENT, SITE_VERSION } from '@/utility/Constants'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type JSX, useState } from 'react'

interface ProfileButtonProps {
  language: LanguageCode
}

export function WideScreenProfileButton({
  language,
}: ProfileButtonProps): JSX.Element {
  const { logout, isAuthenticated } = useAuthentication()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const loginUrl = `/${language}/login${
    pathname !== '/' ? `?return_url=${pathname}` : ''
  }`

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <ProfileButton />
      </DropdownMenuTrigger>
      {open && (
        <DropdownMenuContent className='w-72 lg:w-96 h-fit mr-5 vb dark:bg-[#111]'>
          <DefaultProfile language={language} />
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {isAuthenticated ? (
              <DropdownMenuItem>
                <Button
                  variant={'destructive'}
                  onClick={logout}
                  className='w-full'
                >
                  <ArrowRightStartOnRectangleIcon className='w-4 h-4 mr-2' />
                  Log out
                </Button>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem>
                <Button className='w-full' asChild>
                  <Link href={loginUrl}>Log in</Link>
                </Button>
              </DropdownMenuItem>
            )}
            <p className='w-full text-center text-muted-foreground text-xs py-2 select-none'>
              RGBank v{SITE_VERSION}
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
