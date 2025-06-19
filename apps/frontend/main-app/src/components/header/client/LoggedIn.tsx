'use client'

import { useTranslation } from '@/app/i18n/client'
import AdminButton from '@/components/header/components/AdminButton'
import CommitteeListMenu from '@/components/header/components/CommitteeListMenu'
import DefaultProfile from '@/components/header/components/DefaultProfile'
import { NotificationContent } from '@/components/header/components/NotifitcationContent'
import { ProfileButton } from '@/components/header/components/ProfileButton'
import type { HeaderElement } from '@/components/header/util/HeaderElement'
import { changeLanguage } from '@/components/server/changeLanguage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { LanguageCode } from '@/models/Language'
import {
  useAuthentication,
  useStudent,
} from '@/providers/AuthenticationProvider'
import { useNotifications } from '@/providers/NotificationProvider'
import {
  IS_DEVELOPMENT,
  LANGUAGES,
  LOCAL_STORAGE_READ_NOTIFICATIONS_KEY,
  SITE_VERSION,
} from '@/utility/Constants'
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  LanguageIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline'
import { useTheme } from 'next-themes'
import { Link } from 'next-view-transitions'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { type JSX, useState } from 'react'
import './navigation.css'

interface Props {
  language: LanguageCode
}

interface ProfileButtonProps {
  language: LanguageCode
}

export function WideScreenProfileButton({
  language,
}: ProfileButtonProps): JSX.Element {
  const { logout, isAuthenticated } = useAuthentication()
  const { t } = useTranslation(language, 'header')
  const { t: commonT } = useTranslation(language, 'common')
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const loginUrl = `/${language}/login${
    pathname !== '/' ? `?return_url=${pathname}` : ''
  }`

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <ProfileButton />
      </DropdownMenuTrigger>
      {open && (
        <DropdownMenuContent className='w-72 lg:w-96 h-fit mr-5 vb dark:bg-[#111]'>
          <DefaultProfile language={language} />
          <AdminButton language={language} />
          <CommitteeListMenu language={language} />
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {isAuthenticated ? (
              <DropdownMenuItem>
                <Button
                  variant={'destructive'}
                  onClick={logout}
                  className='w-full'
                >
                  <ArrowRightStartOnRectangleIcon className='w-4 h-4 mr-2' />
                  {t('logout')}
                </Button>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem>
                <Button className='w-full' asChild>
                  <Link href={loginUrl}>{t('login')}</Link>
                </Button>
              </DropdownMenuItem>
            )}
            <p className='w-full text-center text-muted-foreground text-xs py-2 select-none'>
              {commonT('title')} v{SITE_VERSION}
              <span className='text-red-400 font-bold'>
                {IS_DEVELOPMENT ? ' DEV' : ''}
              </span>
            </p>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}

export function NarrowScreenProfileButton({
  language,
}: ProfileButtonProps): JSX.Element {
  const { t } = useTranslation(language, 'header')
  const { t: preferences } = useTranslation(language, 'preferences')
  const { t: commonT } = useTranslation(language, 'common')
  const headerElements: HeaderElement[] = t('navs', {
    returnObjects: true,
  }) as HeaderElement[]
  const [collasibleOpen, setCollapsibleOpen] = useState<boolean[]>(
    headerElements.map((element) => !!element.subNavs)
  )
  const [sheetOpen, setSheetOpen] = useState(false)
  const { logout } = useAuthentication()
  const { student } = useStudent()
  const { theme, setTheme } = useTheme()
  let { notifications } = useNotifications()
  const pathname = usePathname()
  const loginUrl = `/${language}/login${
    pathname !== '/' ? `?return_url=${pathname}` : ''
  }`

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

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        {student ? (
          <ProfileButton />
        ) : (
          <Button variant={'ghost'} size={'icon'} className='w-full h-full'>
            <Bars3Icon className='w-6 h-6' />
          </Button>
        )}
      </SheetTrigger>
      {sheetOpen && (
        <SheetContent side={'right'} className='overflow-y-auto p-0!'>
          <SheetHeader className='p-4 pb-2'>
            {student ? (
              <Link
                href={`/${language}/profile`}
                className='flex items-center gap-4'
              >
                {student.profile_picture_url ? (
                  <Image
                    src={student.profile_picture_url}
                    width={48}
                    height={48}
                    alt='Profile Picture'
                    className='w-12 rounded-full bg-white overflow-hidden border-2 border-yellow-400'
                  />
                ) : (
                  <div className='bg-primary text-black w-12 border border-white dark:border-black aspect-square rounded-full grid place-items-center font-semibold'>
                    {`${student.first_name.charAt(0)}${student.last_name ? student.last_name.charAt(0) : ''}`}
                  </div>
                )}

                <div className='flex flex-col'>
                  <SheetTitle className='text-start mb-0'>{`${student.first_name} ${student.last_name}`}</SheetTitle>
                  <SheetDescription className='text-start'>
                    {student.email || 'No email'}
                  </SheetDescription>
                </div>
              </Link>
            ) : (
              <>
                <SheetTitle className='text-start mb-0'>
                  {t('guest')}
                </SheetTitle>
                <SheetDescription className='text-start'>
                  {t('guest_welcome')}
                </SheetDescription>
              </>
            )}
          </SheetHeader>
          <ScrollArea
            style={{
              height: 'calc(100dvh - 20rem)',
            }}
          >
            <div className='px-2 pt-3 mb-2 h-full'>
              <div className='px-2 mb-2'>
                <p className='text-xs font-semibold text-muted-foreground tracking-wider uppercase'>
                  {t('navigation')}
                </p>
              </div>
              <nav className='w-full h-fit z-10 justify-between'>
                <ul className='space-y-2'>
                  <li>
                    <Link
                      href={`/${language}`}
                      className='flex items-center h-10 px-3 rounded-md hover:bg-muted active:scale-[0.98] transition-transform'
                    >
                      {t('home')}
                    </Link>
                  </li>
                  {headerElements.map((element, index) => (
                    <li key={element.title}>
                      {element.subNavs ? (
                        <Collapsible>
                          <CollapsibleTrigger
                            onClick={() => {
                              setCollapsibleOpen((prev) => {
                                const newCollapsibleOpen = [...prev]
                                newCollapsibleOpen[index] =
                                  !newCollapsibleOpen[index]
                                return newCollapsibleOpen
                              })
                            }}
                            className='flex w-full items-center justify-between h-10 px-3 rounded-md hover:bg-muted active:scale-[0.98] transition-all'
                          >
                            {element.title}
                            <ChevronDownIcon
                              className={`w-4 h-4 transform transition-transform ${
                                collasibleOpen[index] ? 'rotate-180' : ''
                              }`}
                            />
                          </CollapsibleTrigger>
                          <CollapsibleContent className='collapsible-content w-full'>
                            <ul className='ml-4 mt-2 space-y-2 h-[90%] text-muted-foreground'>
                              {element.subNavs.map((subNav) => (
                                <li key={subNav.title}>
                                  <Link
                                    href={`/${language}${subNav.link}`}
                                    className='flex items-center h-10 px-3 rounded-md hover:bg-muted active:scale-[0.98] transition-transform'
                                    onClick={() => setSheetOpen(false)}
                                  >
                                    {subNav.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <Link
                          href={`/${language}${element.link}`}
                          className='flex items-center h-10 px-3 rounded-md hover:bg-muted active:scale-[0.98] transition-transform'
                          onClick={() => setSheetOpen(false)}
                        >
                          {element.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
              {student && (
                <div className='py-2'>
                  <div className='px-2 mb-2'>
                    <p className='text-xs font-semibold text-muted-foreground tracking-wider uppercase'>
                      {t('account')}
                    </p>
                  </div>
                  <div className='space-y-1.5 overflow-y-auto'>
                    <Button
                      variant={'ghost'}
                      asChild
                      className='w-full flex items-center h-10 px-3 rounded-md hover:bg-muted active:scale-[0.98] transition-transform gap-2 justify-start'
                    >
                      <Link
                        href={`/${language}/account`}
                        className=''
                        onClick={() => setSheetOpen(false)}
                      >
                        <Cog6ToothIcon className='w-6 h-6' />
                        {t('account_settings')}
                      </Link>
                    </Button>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant={'ghost'}
                          className='w-full flex items-center h-10 px-3 rounded-md hover:bg-muted active:scale-[0.98] transition-transform gap-3 justify-between'
                          onClick={addAllRead}
                        >
                          <div className='flex items-center gap-2'>
                            <BellIcon className='w-6 h-6' />
                            {t('notifications')}
                          </div>
                          <Badge
                            className={`ml-auto ${isAllRead() ? 'hidden' : ''}`}
                          >
                            NEW
                          </Badge>
                        </Button>
                      </SheetTrigger>
                      <SheetContent
                        side={'bottom'}
                        className='min-h-[75vh] overflow-y-auto px-1 sm:px-6'
                      >
                        <SheetHeader>
                          <SheetTitle>
                            {t('notifications')}
                            <sup>
                              <span className='text-xs text-red-500 font-semibold ml-1 tracking-wide select-none'>
                                Beta
                              </span>
                            </sup>
                          </SheetTitle>
                          <SheetDescription className='text-muted-foreground'>
                            {t('notifications_description')}
                          </SheetDescription>
                        </SheetHeader>
                        {notifications.length === 0 ? (
                          <div className='w-full min-h-20 h-full grid place-items-center z-10 tracking-wider text-neutral-800 dark:text-neutral-300 select-none bg-neutral-100 dark:bg-neutral-800 rounded-md'>
                            {commonT('no_notifications')}
                          </div>
                        ) : (
                          (Array.isArray(notifications)
                            ? notifications
                            : []
                          ).map((notification) =>
                            notification.translations[0].url ? (
                              <div
                                key={notification.notification_id}
                                className='relative w-full h-full'
                              >
                                <div
                                  className={`bg-primary w-1 h-1 rounded-full absolute left-0 top-0 bottom-0 my-auto ${isRead(notification.notification_id) ? 'hidden' : ''}`}
                                />

                                <Link
                                  href={`/${language}/${notification.translations[0].url}`}
                                  className='w-full h-fit grid grid-cols-[auto_1fr] items-center gap-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 ease-in-out rounded-lg'
                                >
                                  <NotificationContent
                                    notification={notification}
                                    language={language}
                                  />
                                </Link>
                              </div>
                            ) : (
                              <div
                                key={notification.notification_id}
                                className='relative w-full h-full'
                              >
                                <div
                                  className={`bg-primary w-1 h-1 rounded-full absolute left-0 top-0 bottom-0 my-auto ${isRead(notification.notification_id) ? 'hidden' : ''}`}
                                />

                                <div className='w-full h-20 flex items-center gap-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 ease-in-out rounded-lg'>
                                  <NotificationContent
                                    notification={notification}
                                    language={language}
                                  />
                                </div>
                              </div>
                            )
                          )
                        )}
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <SheetFooter className='flex flex-col! gap-4 bottom-0 absolute left-0 right-0 bg-white pb-2 px-4'>
            <div className='grid grid-cols-1 xs:grid-cols-2 gap-1 xs:gap-4'>
              <div className='space-y-1.5'>
                <Label className='text-xs font-medium text-muted-foreground px-1'>
                  {preferences('theme')}
                </Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder={preferences('select_theme')}>
                      <div className='flex items-center gap-2'>
                        {theme === 'dark' ? (
                          <MoonIcon className='h-4 w-4' />
                        ) : (
                          <SunIcon className='h-4 w-4' />
                        )}
                        {theme === 'dark'
                          ? preferences('dark_theme')
                          : preferences('light_theme')}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent side='top'>
                    <SelectItem value='light'>
                      <div className='flex items-center gap-2'>
                        <SunIcon className='h-4 w-4' />
                        {preferences('light_theme')}
                      </div>
                    </SelectItem>
                    <SelectItem value='dark'>
                      <div className='flex items-center gap-2'>
                        <MoonIcon className='h-4 w-4' />
                        {preferences('dark_theme')}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className='text-xs font-medium text-muted-foreground px-1'>
                  {preferences('language')}
                </Label>
                <Select
                  defaultValue={language}
                  onValueChange={(value) => {
                    changeLanguage(
                      value as LanguageCode,
                      window.location.pathname
                    )
                  }}
                >
                  <SelectTrigger>
                    <SelectValue>
                      <div className='flex items-center gap-2'>
                        <LanguageIcon className='h-4 w-4' />
                        {LANGUAGES[language].name}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent side='top'>
                    {Object.entries(LANGUAGES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        <div className='flex items-center gap-2'>
                          <div className='w-6 h-auto'>{value.flag_icon}</div>
                          {value.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {student ? (
              <Button
                variant={'destructive'}
                className='w-full gap-2'
                onClick={logout}
              >
                <ArrowRightStartOnRectangleIcon className='w-6 h-6' />
                {t('logout')}
              </Button>
            ) : (
              <Button className='w-full gap-2' asChild>
                <Link href={loginUrl}>{t('login')}</Link>
              </Button>
            )}
            <div className='flex flex-col items-center text-xs text-muted-foreground select-none'>
              <p className='w-full text-center text-muted-foreground'>
                {commonT('long_title')}
              </p>
              <p>
                {`v${SITE_VERSION}`}

                <span className='text-red-400 font-bold'>
                  {IS_DEVELOPMENT ? ' DEV' : ''}
                </span>
              </p>
            </div>
          </SheetFooter>
        </SheetContent>
      )}
    </Sheet>
  )
}
