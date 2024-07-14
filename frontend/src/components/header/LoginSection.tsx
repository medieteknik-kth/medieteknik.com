'use client'
import React, { useCallback } from 'react'
import { TFunction } from 'next-i18next'
import Logo from 'public/images/logo.webp'
import StyrelsenIcon from 'public/images/committees/styrelsen.png'
import {
  UserCircleIcon,
  Cog6ToothIcon,
  UserIcon,
  UserGroupIcon,
  ArrowRightStartOnRectangleIcon,
  LifebuoyIcon,
} from '@heroicons/react/24/outline'
import { useTranslation } from '@/app/i18n/client'
import Link from 'next/link'
import { HeaderElement } from './Header'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { API_BASE_URL } from '@/utility/Constants'
import Student from '@/models/Student'
import NotificationHeader from './Notification'
import OptionsHeader from './Options'
import { useAuthentication } from '@/providers/AuthenticationProvider'

function UserLoggedIn({
  t,
  data,
  logout,
}: {
  t: TFunction
  data: Student
  logout: () => void
}) {
  const profileElements: HeaderElement[] = t('profileNavs', {
    returnObjects: true,
  })

  const searchParams = useSearchParams()
  const createSearchParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(key, value)
      return params.toString()
    },
    [searchParams]
  )

  let username = data.first_name + ' ' + data.last_name
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className='w-full h-full flex justify-center xl:justify-end items-center mr-2 hover:bg-white/25 hover:text-white border-b-2 border-transparent hover:border-yellow-400 rounded-none'
          variant={'ghost'}
        >
          <p className='text-sm hidden flex-col items-end mr-4 uppercase xl:flex'>
            {username}
          </p>
          <div className='xl:mr-4 border border-white rounded-full bg-white'>
            <Avatar>
              <AvatarImage
                src={Logo.src}
                width={40}
                height={40}
                alt='Profile Picture'
                loading='lazy'
              />
              <AvatarFallback>Profile Picture</AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-72 sm:w-96 h-fit mr-2'>
        <DropdownMenuLabel className='border-b-2 border-yellow-400 text-lg flex flex-col'>
          {username}
          <span className='font-normal text-sm text-neutral-500'>
            Your Account
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href='/profile'
              className='w-full flex items-center pr-2 border-l-2 border-transparent hover:border-yellow-400 rounded-l-none py-2 cursor-pointer mb-1'
              title='Your profile'
            >
              <UserIcon className='w-4 h-4 mr-2' />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href='/account'
              className='w-full flex items-center pr-2 border-l-2 border-transparent hover:border-yellow-400 rounded-l-none py-2 cursor-pointer'
              title='Account settings'
            >
              <Cog6ToothIcon className='w-4 h-4 mr-2' />
              <span>Account Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserGroupIcon className='w-4 h-4 mr-2' />
              <span>Committees</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className='w-fit'>
                <DropdownMenuItem>
                  <Link
                    href='/committee'
                    className='w-full flex !justify-start'
                  >
                    <Avatar className='w-4 h-4 mr-1'>
                      <AvatarImage
                        src={StyrelsenIcon.src}
                        alt='Profile Picture'
                      />
                      <AvatarFallback>Committee Picture</AvatarFallback>
                    </Avatar>
                    <span>Styrlesen</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href='/committee'
                    className='w-full flex items-center !justify-start'
                  >
                    <Avatar className='w-4 h-4 mr-1'>
                      <AvatarImage
                        src={StyrelsenIcon.src}
                        alt='Profile Picture'
                      />
                      <AvatarFallback>Committee Picture</AvatarFallback>
                    </Avatar>
                    <span>Näringslivsgruppen</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href='/support'
              className='w-full flex items-center pr-2 border-l-2 border-transparent hover:border-yellow-400 rounded-l-none py-2 cursor-pointer'
              title='Support'
            >
              <LifebuoyIcon className='w-4 h-4 mr-2' />
              <span>Support</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button variant={'destructive'} onClick={logout} className='w-full'>
              <ArrowRightStartOnRectangleIcon className='w-4 h-4 mr-2' />
              Logout
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Guest({ t }: { t: TFunction }) {
  return (
    <Link
      href='/login'
      className='w-full h-full flex justify-center xl:justify-end items-center mr-2 hover:bg-white/25 hover:text-white border-b-2 border-transparent hover:border-yellow-400 rounded-none'
      title={t('login')}
      aria-label={t('login')}
    >
      <p className='text-sm hidden flex-col items-end mr-4 uppercase xl:flex'>
        {t('login')}
      </p>
      <UserCircleIcon className='w-10 h-10 mr-4' />
    </Link>
  )
}

export default function LoginSection({ language }: { language: string }) {
  const { t } = useTranslation(language, 'header')
  const { student, logout } = useAuthentication()

  return (
    <div className='w-fit xl:w-[500px] h-full relative flex gap-4'>
      {student ? (
        <NotificationHeader language={language} />
      ) : (
        <OptionsHeader language={language} />
      )}
      {student ? (
        <UserLoggedIn t={t} data={student} logout={logout} />
      ) : (
        <Guest t={t} />
      )}
    </div>
  )
}
