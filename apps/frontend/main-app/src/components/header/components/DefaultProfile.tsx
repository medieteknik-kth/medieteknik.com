'use client'

import { useTranslation } from '@/app/i18n/client'
import PreferencesMenu from '@/components/header/components/PreferencesMenu'
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
import type { LanguageCode } from '@/models/Language'
import { useStudent } from '@/providers/AuthenticationProvider'
import {
  AdjustmentsHorizontalIcon,
  Cog6ToothIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { Link } from 'next-view-transitions'
import Image from 'next/image'

import type { JSX } from 'react'

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
  const { student } = useStudent()
  const { t } = useTranslation(language, 'header')

  const username = student
    ? `${student.first_name} ${student.last_name || ''}`
    : 'Gäst'

  return student ? (
    <>
      <div className='flex items-center px-2'>
        <div className='w-12 border border-white dark:border-black rounded-full bg-white overflow-hidden'>
          {student.profile_picture_url ? (
            <Image
              src={student.profile_picture_url}
              width={48}
              height={48}
              alt='Profile Picture'
              loading='lazy'
            />
          ) : (
            <div className='bg-primary text-black'>
              {`${student.first_name.charAt(0)} ${student.last_name ? student.last_name.charAt(0) : ''}`}
            </div>
          )}
        </div>
        <DropdownMenuLabel className='w-full text-lg flex flex-col max-w-[300px]'>
          <p className='truncate'>{username}</p>
          <span className='font-normal text-sm text-muted-foreground leading-3'>
            {student.email ?? ''}
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
  ) : (
    <>
      <div className='flex items-center px-2'>
        <DropdownMenuLabel className='w-full text-lg flex flex-col ml-2 max-w-[300px]'>
          <p className='truncate'>{username}</p>
          <span className='font-normal text-sm text-muted-foreground leading-3'>
            Välkommen
          </span>
        </DropdownMenuLabel>
      </div>
      <DropdownMenuSeparator />
    </>
  )
}
