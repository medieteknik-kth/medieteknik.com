'use client'

import { useTranslation } from '@/app/i18n/client'
import AdminButton from '@/components/header/components/AdminButton'
import CommitteeListMenu from '@/components/header/components/CommitteeListMenu'
import DefaultProfile from '@/components/header/components/DefaultProfile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { SITE_VERSION } from '@/utility/Constants'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'

import type { JSX } from 'react'

interface Props {
  language: LanguageCode
}

/**
 * @name UserLoggedIn
 * @description The component that displays the user's profile picture and name when logged in, and provides a dropdown menu with options.
 *
 * @param {Props} props
 * @param {string} props.language - The language of the application.
 *
 * @returns {JSX.Element} The UserLoggedIn component.
 */
export default function UserLoggedIn({ language }: Props): JSX.Element {
  const { student, logout } = useAuthentication()
  const { t } = useTranslation(language, 'header')
  const { t: commonT } = useTranslation(language, 'common')

  if (!student) {
    return <></>
  }

  let username = `${student.first_name} ${student.last_name || ''}`
  username = username.length > 28 ? `${username.slice(0, 28)}...` : username
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            className='w-full h-full flex justify-center xl:justify-end items-center rounded-l-none rounded-r-md gap-2'
            variant={'ghost'}
          >
            <p className='text-base hidden xl:flex max-w-[248px] overflow-hidden tracking-wide'>
              {username}
            </p>
            <Avatar className='border border-white dark:border-black rounded-full bg-white'>
              <AvatarImage
                src={student.profile_picture_url}
                width={64}
                height={64}
                alt='Profile Picture'
                loading='lazy'
              />
              <AvatarFallback className='bg-primary text-black'>
                {`${student.first_name.charAt(0)} ${student.last_name ? student.last_name.charAt(0) : ''}`}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-72 sm:w-96 h-fit mr-3 dark:bg-[#111]'>
          <DefaultProfile language={language} />
          <AdminButton language={language} />
          <CommitteeListMenu language={language} />
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
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
            <p className='w-full text-center text-muted-foreground text-xs py-2 select-none'>
              {commonT('title')} v{SITE_VERSION}
            </p>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
