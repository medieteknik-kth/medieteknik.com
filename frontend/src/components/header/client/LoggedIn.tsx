'use client'

import { useTranslation } from '@/app/i18n/client'
import AdminButton from '@/components/header/components/AdminButton'
import CommitteeListMenu from '@/components/header/components/CommitteeListMenu'
import DefaultProfile from '@/components/header/components/DefaultProfile'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'
import Logo from 'public/images/logo.webp'

interface Props {
  language: string
}

/**
 * @name UserLoggedIn
 * @description The component that displays the user's profile picture and name when logged in, and provides a dropdown menu with options.
 *
 * @param {Props} props
 * @param {string} props.language - The language of the application.
 * @returns {JSX.Element} The UserLoggedIn component.
 */
export default function UserLoggedIn({ language }: Props): JSX.Element {
  const { student, logout } = useAuthentication()
  const { t } = useTranslation(language, 'header')

  if (!student) {
    return <></>
  }

  let username = student.first_name + ' ' + (student.last_name || '')
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className='w-full h-full flex justify-center xl:justify-end items-center rounded-none'
          variant={'ghost'}
        >
          <p className='text-sm hidden flex-col items-end mr-4 uppercase xl:flex'>
            {username}
          </p>
          <Avatar className='xl:mr-4 border border-white rounded-full bg-white'>
            <AvatarImage
              src={student.profile_picture_url || Logo.src}
              width={64}
              height={64}
              alt='Profile Picture'
              loading='lazy'
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-72 sm:w-96 h-fit mr-2'>
        <DefaultProfile language={language} />
        <AdminButton language={language} />
        <CommitteeListMenu language={language} />
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Button variant={'destructive'} onClick={logout} className='w-full'>
              <ArrowRightStartOnRectangleIcon className='w-4 h-4 mr-2' />
              {t('logout')}
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
