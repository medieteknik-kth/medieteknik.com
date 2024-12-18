'use client'

import { useTranslation } from '@/app/i18n/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { LanguageCode } from '@/models/Language'
import { BellIcon, Cog8ToothIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Logo from 'public/images/logo.webp'

import type { JSX } from 'react'

interface Props {
  language: LanguageCode
}

/**
 * @name NotificationMenu
 * @description Renderes a dropdown menu with notifications for logged in users
 *
 * @param {Props} props
 * @param {string} props.language - The current language of the site
 *
 * @returns {JSX.Element} The dropdown menu
 */
export default function NotificationMenu({ language }: Props): JSX.Element {
  const { t } = useTranslation(language, 'header')
  const notifications: number = 0

  return (
    <div className='w-20 z-10'>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            size='icon'
            variant='ghost'
            className='w-fit h-full px-4 grid z-10 place-items-center rounded-none'
            title='Notifications'
            aria-label='Notifications Button'
            disabled
            // TODO: Implement Notifications
          >
            {notifications > 0 ? (
              <div className='relative'>
                <BellIcon className='w-8 h-8' />
                <span className='absolute top-0 right-0 w-4 h-4 bg-yellow-500 rounded-full text-xs text-black grid place-items-center'>
                  {notifications > 9 ? '9+' : notifications}
                </span>
              </div>
            ) : (
              <BellIcon className='w-8 h-8' />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent asChild>
          <Card>
            <CardHeader className='p-0'>
              <div className='h-full relative px-6 pt-6 pb-1'>
                <CardTitle>{t('notifications')}</CardTitle>
                <CardDescription>Recent notifications</CardDescription>
                <Button
                  asChild
                  variant='outline'
                  size='icon'
                  title='Manage Notification Settings'
                  aria-label='Manage Notification Settings'
                  className='absolute right-6 top-6'
                >
                  <Link href='../account'>
                    <Cog8ToothIcon className='w-6 h-6' />
                  </Link>
                </Button>
              </div>

              <div className='px-6 pb-4'>
                <Separator />
              </div>
            </CardHeader>
            <CardContent>
              <Link
                href='/'
                title='Notification 1'
                aria-label='Notification 1'
                className='hover:bg-black/10'
              >
                <Card className='w-96 bg-inherit'>
                  <CardHeader className='flex flex-row items-center'>
                    <Avatar className='w-12 h-12 mr-2 border-2 border-black'>
                      <AvatarImage src={Logo.src} alt='Committee Picture' />
                      <AvatarFallback>Committee Picture</AvatarFallback>
                    </Avatar>
                    <CardTitle className='text-md'>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <CardDescription>
                      Styrelsen <span> • 2 days ago</span>
                    </CardDescription>
                  </CardFooter>
                </Card>
              </Link>
            </CardContent>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
