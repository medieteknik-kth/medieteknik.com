'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { LanguageCode } from '@/models/Language'
import { UPDATES, VersionControl } from '@/utility/Updates'
import { BellIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import Logo from 'public/images/logo.webp'
import { type JSX, useState } from 'react'

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
  const { t: commonT } = useTranslation(language, 'common')
  const versionControl = new VersionControl()
  const [notifications, setNotifications] = useState(
    versionControl.checkForUpdates() ? versionControl.countUpdatesBehind() : 0
  )

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
            onClick={() => {
              versionControl.markAsSeen()
              setNotifications(0)
            }}
          >
            {notifications > 0 ? (
              <div className='relative'>
                <BellIcon className='w-7 h-7' />
                <span className='absolute top-0 right-0 w-4 h-4 bg-yellow-500 rounded-full text-xs text-black grid place-items-center'>
                  {notifications > 9 ? '9+' : notifications}
                </span>
              </div>
            ) : (
              <BellIcon className='w-7 h-7' />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent asChild>
          <Card className='min-w-96'>
            <CardHeader>
              <CardTitle>{t('notifications')}</CardTitle>
              <CardDescription>Updates and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {UPDATES.map((update) => (
                <Button
                  key={update.version}
                  asChild
                  variant={'ghost'}
                  className='flex justify-start gap-2 items-center'
                >
                  <Link
                    href={`/${language}/updates/${update.version}`}
                    className='h-20'
                  >
                    <Image
                      src={Logo}
                      alt='Logo'
                      width={32}
                      height={32}
                      className='h-10 w-auto aspect-square rounded-md'
                    />
                    <div className='flex flex-col justify-between h-full p-2'>
                      <div>
                        <p className='text-sm font-semibold leading-3 tracking-tight'>
                          {commonT('title')} v{update.version}
                        </p>
                        <p className='text-xs'>{update.description}</p>
                      </div>
                      <div>
                        <p className='text-xs text-muted-foreground'>
                          {update.date}
                        </p>
                      </div>
                    </div>
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
