'use client'
import React, { useState } from 'react'
import { TFunction } from 'next-i18next'
import Image from 'next/image'
import Logo from 'public/images/logo.png'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

function UserLoggedIn({ params }: { params: { t: TFunction } }) {
  const { t } = params
  const profileElements: HeaderElement[] = t('profileNavs', {
    returnObjects: true,
  })

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  let hasProfilePicture: boolean = false
  let username = 'André Eriksson'
  let role = 'Webmaster'
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className='w-full h-full flex justify-end items-center'>
        <div className='flex flex-col items-end mr-4 uppercase'>
          {username}
          {role && <span className='text-xs text-cyan-400'>{role}</span>}
        </div>
        <div className='mr-4 border border-white rounded-full'>
          <Avatar>
            <AvatarImage src={Logo.src} alt='Profile Picture' />
            <AvatarFallback>Profile Picture</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-96 h-fit mr-2'>
        <DropdownMenuLabel>Your Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              href='/profile'
              className='w-full flex items-center justify-between pr-2'
            >
              <UserIcon className='w-4 h-4 mx-2' />
              <span>Profile</span>
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href='/account'
              className='w-full flex items-center justify-between pr-2'
            >
              <Cog6ToothIcon className='w-4 h-4 mx-2' />
              <span>Account Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className='w-full flex items-center'>
              <UserGroupIcon className='w-4 h-4 mx-2' />
              <span>Committees</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className='w-fit'>
                <DropdownMenuItem>
                  <Link href='/committee' className='w-full flex items-center'>
                    <Avatar className='w-4 h-4 mx-1'>
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
                  <Link href='/committee' className='w-full flex items-center'>
                    <Avatar className='w-4 h-4 mx-1'>
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
            <Link href='/support' className='flex items-center'>
              <LifebuoyIcon className='w-4 h-4 mx-2' />
              Support
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href='/logout' className='flex items-center'>
              <ArrowRightStartOnRectangleIcon className='w-4 h-4 mx-2' />
              Logout
            </Link>
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
  params: { language, loggedIn },
}: {
  params: { language: string; loggedIn: boolean }
}) {
  const { t } = useTranslation(language, 'header')

  return (
    <div className='w-20 xl:w-96 h-full relative'>
      {loggedIn ? <UserLoggedIn params={{ t }} /> : <Guest params={{ t }} />}
    </div>
  )
}
