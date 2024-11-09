'use client'

import { useTranslation } from '@/app/i18n/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { Cog6ToothIcon, UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Logo from 'public/images/logo.webp'

import type { JSX } from 'react'

interface Props {
  language: string
}

/**
 * @name DefaultProfile
 * @description The component that displays the user's profile picture and name when logged in.
 *
 * @param {Props} props
 * @param {string} props.language - The language of the application.
 *
 * @returns {JSX.Element} The DefaultProfile component.
 */
export default function DefaultProfile({ language }: Props): JSX.Element {
  const { student } = useAuthentication()
  const { t } = useTranslation(language, 'header')

  if (!student) {
    return <></>
  }

  const username = student.first_name + ' ' + (student.last_name || '')

  return (
    <>
      <div className='flex items-center px-2'>
        <Avatar>
          <AvatarImage
            src={student.profile_picture_url || Logo.src}
            width={40}
            height={40}
            alt='Profile Picture'
            loading='lazy'
          />
          <AvatarFallback>Profile Picture</AvatarFallback>
        </Avatar>
        <DropdownMenuLabel className='w-full text-lg flex flex-col ml-2 max-w-[300px]'>
          <p className='truncate '>{username}</p>
          <span className='font-normal text-sm text-muted-foreground leading-3'>
            {student.email}
          </span>
        </DropdownMenuLabel>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link
            href={`/${language}/profile`}
            className='w-full flex items-center gap-2 pr-2 border-l-2 border-transparent hover:border-yellow-400 rounded-l-none py-2 cursor-pointer mb-1'
            title='Your profile'
          >
            <UserIcon className='w-4 h-4' />
            <span>{t('profile')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/${language}/account`}
            className='w-full flex items-center gap-2 pr-2 border-l-2 border-transparent hover:border-yellow-400 rounded-l-none py-2 cursor-pointer'
            title={t('account_settings')}
          >
            <Cog6ToothIcon className='w-4 h-4' />
            <span>{t('account_settings')}</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  )
}
