'use client'

import { useTranslation } from '@/app/i18n/client'
import { subscribeUser } from '@/components/services/PushSubscription'
import Loading from '@/components/tooltips/Loading'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from '@/components/ui/use-toast'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { notificationSchema } from '@/schemas/user/notification'
import { API_BASE_URL } from '@/utility/Constants'
import {
  CheckIcon,
  ChevronDownIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Logo from 'public/images/logo.webp'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import type { z } from 'zod'

interface Props {
  language: LanguageCode
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function NotificationPage({ language }: Props) {
  const [open, setOpen] = useState(false)
  const [timezoneOpen, setTimezoneOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState('all')
  const [selectedTimezone, setSelectedTimezone] = useState('Europe/Stockholm')
  const { t } = useTranslation(language, 'account/notifications')
  const [allNews, setAllNews] = useState(false)
  const [allEvents, setAllEvents] = useState(false)
  const { data, error, isLoading } = useSWR<Committee[]>(
    `${API_BASE_URL}/public/committees?language=${language}`,
    fetcher,
    {
      revalidateOnFocus: false,
      fallbackData: [],
    }
  )

  const schema = notificationSchema(data || [])
  type NotificationFormValues = z.infer<typeof schema>

  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      iana: 'Europe/Stockholm',
      email: false,
      push: false,
      site_updates: true,
      committees: [],
    },
  })

  useEffect(() => {
    if (!data || data.length === 0) return
    const notificationSettings = window.localStorage.getItem(
      'notificationSettings'
    )

    if (notificationSettings) {
      const settings = JSON.parse(
        notificationSettings
      ) as NotificationFormValues

      // Check if all news and events are enabled
      const allNews = settings.committees?.every((committee) => committee.news)
      const allEvents = settings.committees?.every(
        (committee) => committee.event
      )

      setAllNews(allNews || false)
      setAllEvents(allEvents || false)

      notificationForm.reset({
        iana: settings.iana,
        email: settings.email,
        push: settings.push,
        site_updates: settings.site_updates,
        committees: data.map((committee) => ({
          committee_id: committee.committee_id,
          news:
            settings.committees?.find(
              (c) => c.committee_id === committee.committee_id
            )?.news || false,
          event:
            settings.committees?.find(
              (c) => c.committee_id === committee.committee_id
            )?.event || false,
        })),
      })
    } else {
      notificationForm.reset({
        iana: 'Europe/Stockholm',
        email: false,
        push: false,
        site_updates: true,
        committees: data.map((committee) => ({
          committee_id: committee.committee_id,
          news: false,
          event: false,
        })),
      })
    }
  }, [data, notificationForm.reset])

  if (error) return <div>{t('error')}</div>
  if (isLoading) return <Loading language={language} />
  if (!data) {
    console.error('No committees found')
    return <div>{t('no_committees')}</div>
  }

  const committees = notificationForm.watch('committees')
  const currentNews =
    selectedNotification === 'all'
      ? allNews
      : committees?.find(
          (committee) => committee.committee_id === selectedNotification
        )?.news || allNews

  const currentEvents =
    selectedNotification === 'all'
      ? allEvents
      : committees?.find(
          (committee) => committee.committee_id === selectedNotification
        )?.event || allEvents

  const updateNotificationSettings = async (data: NotificationFormValues) => {
    let notificationSubscription: PushSubscription | undefined = undefined

    if (data.push) {
      notificationSubscription = await subscribeUser()
    }

    const { email, push } = data

    const notificationPreferences = {
      iana: data.iana,
      site_updates: data.site_updates,
      committees: data.committees,
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/students/notifications?language=${language}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            push: push,
            subscription: notificationSubscription,
            preferences: notificationPreferences,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update notification settings')
      }

      window.localStorage.setItem('notificationSettings', JSON.stringify(data))
      toast({
        title: 'Success',
        style: {
          backgroundColor: 'green',
          color: 'white',
          borderRadius: '0.5rem',
        },
        description: 'Notification settings updated',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Failed',
        style: {
          backgroundColor: 'red',
          color: 'white',
          borderRadius: '0.5rem',
        },
        description:
          'Failed to update notification settings, please try again later.',
      })
    }
  }

  const allCommittees = [
    {
      value: 'all',
      label: t('all_committees'),
      icon: Logo.src,
    },
    ...data.map((committee) => ({
      value: committee.committee_id,
      label: committee.translations[0].title,
      icon: committee.logo_url,
    })),
  ]

  const allIANATimezones = Intl.supportedValuesOf('timeZone').map(
    (timezone) => ({
      value: timezone,
      label: timezone,
    })
  )

  return (
    <section className='w-full max-w-[1100px]'>
      <div className='w-full mb-4 px-4 pt-4'>
        <h2 className='text-lg font-bold'>{t('title')}</h2>
        <p className='text-sm text-muted-foreground'>{t('description')}</p>
        <Separator className='bg-yellow-400 mt-4' />
      </div>
      <Form {...notificationForm}>
        <form
          className='w-full flex flex-col gap-4 px-4'
          onSubmit={notificationForm.handleSubmit(updateNotificationSettings)}
        >
          <FormField
            name='iana'
            render={({ field }) => (
              <FormItem>
                <div>
                  <FormLabel htmlFor='iana' className='text-sm font-semibold'>
                    {t('notification_timezone')}
                  </FormLabel>
                  <p className='text-xs text-muted-foreground'>
                    {t('notification_timezone_description')}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <Popover open={timezoneOpen} onOpenChange={setTimezoneOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          // biome-ignore lint/a11y/useSemanticElements: This is a shadcn/ui component for a combobox
                          role='combobox'
                          id='iana'
                          className='w-72 items-center justify-between'
                        >
                          {field
                            ? allIANATimezones.find(
                                (timezone) => timezone.value === field.value
                              )?.label
                            : t('select_timezone')}
                          <ChevronDownIcon className='w-5 h-5' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-72 p-0'>
                      <Command>
                        <CommandInput placeholder={t('search_timezone')} />
                        <CommandList>
                          <CommandEmpty>{t('no_timezone_found')}</CommandEmpty>
                          <CommandGroup>
                            {allIANATimezones.map((timezone) => (
                              <CommandItem
                                key={timezone.value}
                                value={timezone.value}
                                onSelect={(currentValue) => {
                                  notificationForm.setValue(
                                    'iana',
                                    currentValue === field.value
                                      ? ''
                                      : currentValue
                                  )

                                  setTimezoneOpen(false)
                                }}
                                className='flex items-center justify-between'
                              >
                                {timezone.label}
                                <CheckIcon
                                  className={`w-4 h-4 ${selectedTimezone === timezone.value ? 'text-green-500' : 'hidden'}`}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className='rounded-full p-1 border my-auto'>
                        <InformationCircleIcon className='w-4 h-4' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className='text-xs text-muted-foreground'>
                          {t('notification_timezone_tooltip')}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </FormItem>
            )}
          />

          <section className='flex flex-col gap-2'>
            <div>
              <h3 className='text-sm font-semibold'>
                {t('notification_settings')}
              </h3>
              <p className='text-xs text-muted-foreground'>
                {t('notification_settings_description')}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox disabled checked />
              <Label>{t('web_notifications')}</Label>
            </div>
            <FormField
              name='email'
              disabled
              render={({ field }) => (
                <div className='flex items-center gap-2'>
                  <FormControl>
                    <Checkbox
                      {...field}
                      disabled
                      id='email'
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        if (checked === 'indeterminate') return
                        notificationForm.setValue('push', checked)
                      }}
                    />
                  </FormControl>

                  <FormLabel htmlFor='email'>
                    {t('email_notifications')}
                    <sup
                      className='text-xs text-amber-400 ml-0.5'
                      title='Work in progress'
                    >
                      WIP
                    </sup>
                  </FormLabel>
                </div>
              )}
            />
            <FormField
              name='push'
              render={({ field }) => (
                <div className='flex items-center gap-2'>
                  <FormControl>
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        if (checked === 'indeterminate') return
                        notificationForm.setValue('push', checked)
                      }}
                    />
                  </FormControl>
                  <FormLabel>{t('push_notifications')}</FormLabel>
                </div>
              )}
            />
          </section>

          <section className='flex flex-col gap-2'>
            <div>
              <h3 className='text-sm font-semibold'>
                {t('general_notifications')}
              </h3>
              <p className='text-xs text-muted-foreground'>
                {t('general_notifications_description')}
              </p>
            </div>
            <FormField
              name='site_updates'
              render={({ field }) => (
                <div className='flex items-center gap-2'>
                  <FormControl>
                    <Checkbox
                      {...field}
                      id='site_updates'
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        if (checked === 'indeterminate') return
                        notificationForm.setValue('push', checked)
                      }}
                    />
                  </FormControl>
                  <FormLabel htmlFor='site_updates'>
                    {t('site_update_notifications')}
                  </FormLabel>
                </div>
              )}
            />
          </section>

          <section className='flex flex-col gap-2'>
            <div>
              <h3 className='text-sm font-semibold'>
                {t('committee_notifications')}
              </h3>
              <p className='text-xs text-muted-foreground'>
                {t('committee_notifications_description')}
              </p>
            </div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  // biome-ignore lint/a11y/useSemanticElements: This is a shadcn/ui component for a combobox
                  role='combobox'
                  className='min-w-52 max-w-72 md:w-72 items-center justify-between'
                >
                  <div className='flex items-center gap-2'>
                    <div className='bg-white p-1 rounded-lg'>
                      <Image
                        src={
                          allCommittees.find(
                            (committee) =>
                              committee.value === selectedNotification
                          )?.icon || Logo.src
                        }
                        alt='Committee'
                        unoptimized
                        width={24}
                        height={24}
                      />
                    </div>
                    {selectedNotification
                      ? allCommittees.find(
                          (committee) =>
                            committee.value === selectedNotification
                        )?.label
                      : t('select_committee')}
                  </div>
                  <ChevronDownIcon className='w-5 h-5' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-72 p-0'>
                <Command>
                  <CommandInput placeholder={t('search_committee')} />
                  <CommandList>
                    <CommandEmpty>{t('no_committees_found')}</CommandEmpty>
                    <CommandGroup>
                      {allCommittees.map((committee) => (
                        <CommandItem
                          key={committee.value}
                          value={committee.value}
                          onSelect={(currentValue) => {
                            setSelectedNotification(
                              currentValue === selectedNotification
                                ? 'all'
                                : currentValue
                            )
                            setOpen(false)
                          }}
                          className='flex items-center justify-between'
                        >
                          <div className='flex items-center gap-2'>
                            <div className='bg-white p-1 rounded-lg'>
                              <Image
                                src={committee.icon}
                                alt={committee.label}
                                unoptimized
                                width={24}
                                height={24}
                              />
                            </div>
                            {committee.label}
                          </div>
                          <CheckIcon
                            className={`w-4 h-4 ${selectedNotification === committee.value ? 'text-green-500' : 'text-transparent'}`}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className='flex items-center gap-2'>
              <Checkbox
                checked={currentNews}
                onCheckedChange={(checked) => {
                  if (checked === 'indeterminate') return
                  if (selectedNotification === 'all') {
                    setAllNews(checked)
                    notificationForm
                      .getValues()
                      .committees?.forEach((_, index) => {
                        notificationForm.setValue(
                          `committees.${index}.news`,
                          checked
                        )
                      })
                  } else {
                    setAllNews(false)
                    const index = notificationForm
                      .getValues()
                      .committees?.findIndex(
                        (committee) =>
                          committee.committee_id === selectedNotification
                      )
                    if (!index) {
                      console.warn('Invalid committee ID')
                      return
                    }

                    notificationForm.setValue(
                      `committees.${index}.news`,
                      checked
                    )
                  }
                }}
              />
              <Label>
                {t('news_notifications')}
                {currentNews && allNews && selectedNotification !== 'all' && (
                  <span className='text-xs text-muted-foreground'>
                    {' '}
                    (inherited from <b>{t('all_committees')}</b>)
                  </span>
                )}
              </Label>
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox
                checked={currentEvents}
                onCheckedChange={(checked) => {
                  if (checked === 'indeterminate') return
                  if (selectedNotification === 'all') {
                    setAllEvents(checked)
                    notificationForm
                      .getValues()
                      .committees?.forEach((_, index) => {
                        notificationForm.setValue(
                          `committees.${index}.event`,
                          checked
                        )
                      })
                  } else {
                    setAllEvents(false)
                    console.log(notificationForm.getValues().committees)
                    const index = notificationForm
                      .getValues()
                      .committees?.findIndex(
                        (committee) =>
                          committee.committee_id === selectedNotification
                      )
                    if (!index) {
                      console.error(`Invalid committee ID (${index})`)
                      return
                    }

                    notificationForm.setValue(
                      `committees.${index}.event`,
                      checked
                    )
                  }
                }}
              />
              <Label>
                {t('upcoming_event_notifications')}
                {currentEvents &&
                  allEvents &&
                  selectedNotification !== 'all' && (
                    <span className='text-xs text-muted-foreground'>
                      {' '}
                      (inherited from <b>{t('all_committees')}</b>)
                    </span>
                  )}
              </Label>
            </div>
          </section>

          <Button type='submit'>{t('save')}</Button>
        </form>
      </Form>
    </section>
  )
}
