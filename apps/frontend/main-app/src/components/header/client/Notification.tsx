'use client'

import { useTranslation } from '@/app/i18n/client'
import { NotificationContent } from '@/components/header/components/NotifitcationContent'
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
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { useNotifications } from '@/providers/NotificationProvider'
import { LOCAL_STORAGE_READ_NOTIFICATIONS_KEY } from '@/utility/Constants'
import { BellIcon } from '@heroicons/react/24/outline'
import { Link } from 'next-view-transitions'
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
  const [open, setOpen] = useState(false)
  let { notifications } = useNotifications()
  const { isAuthenticated } = useAuthentication()

  if (!notifications) {
    notifications = []
  }

  /**
   * // TODO: Maybe add a more robust solution for this, like a backend solution
   * @name addAllRead
   * @description Adds all notifications to the local storage as read
   * @returns {void}
   */
  const addAllRead = (): void => {
    window.localStorage.setItem(
      LOCAL_STORAGE_READ_NOTIFICATIONS_KEY,
      notifications
        .map((notification) => notification.notification_id)
        .join(',')
    )
  }

  /**
   * @name isAllRead
   * @description Checks if all notifications are read
   * @returns {boolean} True if all notifications are read, false otherwise
   */
  const isAllRead = (): boolean => {
    const readNotifications = window.localStorage.getItem(
      LOCAL_STORAGE_READ_NOTIFICATIONS_KEY
    )
    return (
      notifications.length > 0 &&
      readNotifications?.split(',').length === notifications.length
    )
  }

  /**
   * @name isRead
   * @description Checks if a notification is read
   * @param {string} notificationId - The id of the notification
   * @returns {boolean | undefined} True if the notification is read, false otherwise, undefined if not set
   */
  const isRead = (notificationId: string): boolean | undefined => {
    const readNotifications = window.localStorage.getItem(
      LOCAL_STORAGE_READ_NOTIFICATIONS_KEY
    )
    return readNotifications?.split(',').includes(notificationId)
  }

  if (!isAuthenticated) {
    return <></>
  }

  return (
    <div className='w-full sm:w-fit h-full z-10'>
      <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size='icon'
            variant='ghost'
            className='w-full sm:w-fit h-full px-4 grid z-10 place-items-center rounded-none'
            title='Notifications'
            aria-label='Notifications Button'
            onClick={addAllRead}
          >
            {notifications.length > 0 ? (
              <div className='relative'>
                <BellIcon className='w-7 h-7' />
                <div
                  className={`absolute top-0 right-0 w-4 h-4 bg-yellow-500 rounded-full text-xs text-black grid place-items-center font-semibold ${isAllRead() ? 'hidden' : ''}`}
                />
              </div>
            ) : (
              <BellIcon className='w-7 h-7' />
            )}
          </Button>
        </DropdownMenuTrigger>
        {open && (
          <DropdownMenuContent asChild>
            <Card className='mr-5 lg:mr-0'>
              <CardHeader className='relative'>
                <CardTitle>
                  {t('notifications')}
                  <sup>
                    <span className='text-xs text-red-500 font-semibold ml-1 tracking-wide select-none'>
                      Beta
                    </span>
                  </sup>
                </CardTitle>
                <CardDescription>
                  {t('notifications_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-0'>
                <ul className='w-full h-96 overflow-y-auto flex flex-col gap-1'>
                  {notifications.length === 0 ? (
                    <li className='w-md lg:w-lg xl:w-xl min-h-20 h-full grid place-items-center z-10 tracking-wider text-neutral-800 dark:text-neutral-300 select-none bg-neutral-100 dark:bg-neutral-800 rounded-md'>
                      {t('no_notifications')}
                    </li>
                  ) : (
                    notifications.map((notification) =>
                      notification.translations[0].url ? (
                        <li
                          key={notification.notification_id}
                          className='relative w-full h-fit'
                        >
                          <div
                            className={`bg-primary w-1 h-1 rounded-full absolute left-0 top-0 bottom-0 my-auto ${isRead(notification.notification_id) ? 'hidden' : ''}`}
                          />
                          <Link
                            href={`/${language}${notification.translations[0].url}`}
                            className='w-md lg:w-lg xl:w-xl h-fit grid grid-cols-[auto_1fr] items-center gap-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 ease-in-out rounded-lg'
                            title={notification.translations[0].body}
                            aria-label={notification.translations[0].body}
                          >
                            <NotificationContent
                              notification={notification}
                              language={language}
                            />
                          </Link>
                        </li>
                      ) : (
                        <li
                          key={notification.notification_id}
                          className='relative w-full h-fit'
                        >
                          <div
                            className={`bg-primary w-1 h-1 rounded-full absolute left-0 top-0 bottom-0 my-auto ${isRead(notification.notification_id) ? 'hidden' : ''}`}
                          />
                          <div
                            className='w-md lg:w-lg xl:w-xl h-fit grid grid-cols-[auto_1fr] items-center gap-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 ease-in-out rounded-lg'
                            title={notification.translations[0].body}
                            aria-label={notification.translations[0].body}
                          >
                            <NotificationContent
                              notification={notification}
                              language={language}
                            />
                          </div>
                        </li>
                      )
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}
