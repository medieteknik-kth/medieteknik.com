'use client'
import React, { useCallback, useState } from 'react'
import { TFunction } from 'next-i18next'
import Image from 'next/image'
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
import { useSearchParams, useRouter } from 'next/navigation'

function UserLoggedIn({ params }: { params: { t: TFunction } }) {
  const { t } = params
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

  let username = 'André Eriksson'
  let role = 'Webmaster'
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className='w-full h-full flex justify-center xl:justify-end items-center'>
        <div className='text-sm hidden flex-col items-end mr-4 uppercase xl:flex'>
          {username}
          {role && <span className='text-xs text-cyan-400'>{role}</span>}
        </div>
        <div className='mr-4 border border-white rounded-full'>
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
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-fit sm:w-96 h-fit mr-2'>
        <DropdownMenuLabel>Your Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href='/profile' className='w-full flex items-center pr-2'>
              <UserIcon className='w-4 h-4 mr-2' />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href='/account' className='w-full flex items-center pr-2'>
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
          <DropdownMenuItem>
            <Link href='/support' className='w-full flex !justify-start'>
              <LifebuoyIcon className='w-4 h-4 mr-2' />
              <span>Support</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button asChild variant={'destructive'}>
              <Link href='/logout' className='w-full flex items-center'>
                <ArrowRightStartOnRectangleIcon className='w-4 h-4 mr-2' />
                Logout
              </Link>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Guest({ params }: { params: { t: TFunction } }) {
  const { t } = params
  return (
    <Link
      href='/login'
      className='w-full h-full text-sm uppercase flex justify-around items-center border-b-2 border-yellow-400 hover:bg-black/25 z-10'
      title={t('login')}
      aria-label={t('login')}
    >
      <p className='w-4/5 text-end truncate flex-col tracking-wider hidden xl:flex'>
        {t('login')}
      </p>
      <UserCircleIcon className='w-10 h-10' />
    </Link>
  )
}

export default function LoginSection({
  language,
  loggedIn,
}: {
  language: string
  loggedIn: boolean
}) {
  const { t } = useTranslation(language, 'header')

  return (
    <div className='w-20 xl:w-96 h-full relative'>
      {loggedIn ? <UserLoggedIn params={{ t }} /> : <Guest params={{ t }} />}
    </div>
  )
}
