'use client'

import { useTranslation } from '@/app/i18n/client'
import PreferencesMenu from '@/components/header/components/PreferencesMenu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { LanguageCode } from '@/models/Language'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import {
  AdjustmentsHorizontalIcon,
  Cog6ToothIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

import { useState, type JSX } from 'react'

interface Props {
  language: LanguageCode
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
  const [openPreferences, setOpenPreferences] = useState(false)

  if (!student) {
    return <></>
  }

  const username = student.first_name + ' ' + (student.last_name || '')

  return (
    <>
      <div className='flex items-center px-2'>
        <Avatar>
          <AvatarImage
            src={student.profile_picture_url}
            width={40}
            height={40}
            alt='Profile Picture'
            loading='lazy'
          />
          <AvatarFallback className='bg-primary text-black'>
            {student.first_name[0]}
            {''}
            {(student.last_name && student.last_name[0]) || ''}
          </AvatarFallback>
        </Avatar>
        <DropdownMenuLabel className='w-full text-lg flex flex-col ml-2 max-w-[300px]'>
          <p className='truncate'>{username}</p>
          <span className='font-normal text-sm text-muted-foreground leading-3'>
            {student.email}
          </span>
        </DropdownMenuLabel>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuGroup className='flex flex-col gap-0.5'>
        <DropdownMenuItem className='p-0'>
          <Button
            className='w-full flex items-center justify-start gap-2 p-0 pl-2'
            variant={'ghost'}
            asChild
          >
            <Link
              href={`/${language}/profile`}
              className='w-full flex items-center gap-2'
              title='Your profile'
            >
              <UserIcon className='w-4 h-4' />
              <span>{t('profile')}</span>
            </Link>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className='p-0 pr-2'>
              <Button
                className='w-full flex items-center justify-start gap-2 p-0 pl-2'
                variant={'ghost'}
              >
                <AdjustmentsHorizontalIcon className='w-4 h-4' />
                <span>Preferences</span>
              </Button>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className='w-[200px] mr-2 dark:bg-[#111]'>
                <PreferencesMenu language={language} />
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuItem className='p-0'>
          <Button
            className='w-full flex items-center justify-start gap-2 p-0 pl-2'
            variant={'ghost'}
            asChild
          >
            <Link href={`/${language}/account`} title={t('account_settings')}>
              <Cog6ToothIcon className='w-4 h-4' />
              <span>{t('account_settings')}</span>
            </Link>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  )
}
