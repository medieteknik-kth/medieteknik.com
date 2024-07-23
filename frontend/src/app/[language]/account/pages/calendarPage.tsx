'use client'
import { Button } from '@/components/ui/button'
import {
  ArrowPathRoundedSquareIcon,
  ArrowUpTrayIcon,
  Bars3CenterLeftIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardIcon,
  ClockIcon,
  IdentificationIcon,
  InformationCircleIcon,
  MapPinIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {
  addDays,
  addMonths,
  getDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns'
import { useCallback, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Calendar from '@/components/calendar/Calendar'
import { useCalendar } from '@/providers/CalendarProvider'
import { Separator } from '@/components/ui/separator'
import { Event } from '@/models/Items'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { Permission } from '@/models/Permission'

function getPreviousMonthsLastWeekAdjusted(currentDate: Date) {
  const startOfCurrentMonth = startOfMonth(currentDate)
  const startOfCurrentMonthDay = getDay(startOfCurrentMonth) // 0 (Sunday) to 6 (Saturday)

  const lastWeekOfPreviousMonthEnd = subWeeks(startOfCurrentMonth, 0) // One week before the start of this month
  const lastWeekOfPreviousMonthStart = startOfWeek(lastWeekOfPreviousMonthEnd)

  // Adjust to get the days Monday to Friday
  let lastWeekAdjusted = []
  for (let i = 1; i <= 5; i++) {
    const date = addDays(lastWeekOfPreviousMonthStart, i)
    if (date < startOfCurrentMonth) {
      lastWeekAdjusted.push(date)
    }
  }
  return lastWeekAdjusted
}

function getNumberWithOrdinal(number: number) {
  if (typeof number !== 'number' || isNaN(number)) {
    return 'Not a number'
  }

  // Handle special cases for 11, 12, 13
  if (number % 100 >= 11 && number % 100 <= 13) {
    return number + 'th'
  }

  switch (number % 10) {
    case 1:
      return number + 'st'
    case 2:
      return number + 'nd'
    case 3:
      return number + 'rd'
    default:
      return number + 'th'
  }
}

export default function CalendarPage({ language }: { language: string }) {
  const [openEvent, setOpenEvent] = useState<boolean>(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const { date, setDate } = useCalendar()
  const { permissions } = useAuthentication()
  const range = [subMonths(new Date(), 3), addMonths(new Date(), 3)]

  const addMonth = useCallback(() => {
    if (addMonths(new Date(date), 1) > addMonths(new Date(range[1]), 1)) {
      return
    }
    setDate(addMonths(new Date(date), 1))
  }, [date])

  const subtractMonth = useCallback(() => {
    if (subMonths(new Date(date), 1) < subMonths(new Date(range[0]), 1)) {
      return
    }
    setDate(subMonths(new Date(date), 1))
  }, [date])

  return (
    <section className='w-full h-fit relative grow dark:bg-[#111]'>
      <div className='w-full flex items-center justify-center border-b-2 border-yellow-400'>
        <h1 className='text-2xl py-4'>Your Calendar</h1>
      </div>

      <div className='flex flex-col items-center gap-12 xl:gap-2 mb-10 px-8 md:px-32'>
        <div className='py-4'>
          <div className='flex flex-col items-center'>
            <h2 className='text-3xl font-bold'>
              {date.toLocaleDateString(language, {
                year: 'numeric',
              })}
            </h2>
            <div className='flex items-center gap-4'>
              <Button
                size={'icon'}
                onClick={subtractMonth}
                title='Previous Month'
                disabled={
                  subMonths(date, 1) <= subMonths(new Date(range[0]), 1)
                }
              >
                <ChevronLeftIcon className='w-6 h-6' />
              </Button>
              <h3
                className={`w-40 text-2xl text-center hidden md:block text-neutral-500 ${
                  subMonths(new Date(date), 1) <=
                  subMonths(new Date(range[0]), 1)
                    ? 'cursor-not-allowed text-neutral-300'
                    : 'cursor-pointer hover:text-neutral-800'
                }`}
                onClick={subtractMonth}
              >
                {subMonths(date, 1).toLocaleDateString(language, {
                  month: 'long',
                })}
              </h3>
              <h3 className='w-40 text-2xl text-center'>
                {date.toLocaleDateString(language, {
                  month: 'long',
                })}
              </h3>
              <h3
                className={`w-40 text-2xl text-center hidden md:block text-neutral-500 ${
                  addMonths(new Date(date), 1) >=
                  addMonths(new Date(range[1]), 1)
                    ? 'cursor-not-allowed text-neutral-300'
                    : 'cursor-pointer hover:text-neutral-800'
                }`}
                onClick={addMonth}
              >
                {addMonths(date, 1).toLocaleDateString(language, {
                  month: 'long',
                })}
              </h3>
              <Button
                size={'icon'}
                onClick={addMonth}
                title='Next Month'
                disabled={
                  addMonths(date, 1) >= addMonths(new Date(range[1]), 1)
                }
              >
                <ChevronRightIcon className='w-6 h-6' />
              </Button>
            </div>
          </div>
        </div>
        <Calendar
          onEventClickCallback={(event) => {
            setSelectedEvent(event)
            setOpenEvent(true)
          }}
        >
          <div className='absolute right-0 -top-12 flex gap-2'>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size={'icon'}
                  variant={'outline'}
                  title='Subscribe or Export'
                >
                  <ArrowUpTrayIcon className='w-6 h-6' />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Subscribe or Export Calendar</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col'>
                  <div className='flex items-center gap-2 mb-2'>
                    <ArrowPathRoundedSquareIcon className='w-6 h-6' />
                    <p>Subscribe</p>
                  </div>
                  <div className='grid grid-cols-12'>
                    <p className='w-auto text-sm text-nowrap h-10 border rounded-xl px-2 py-1 overflow-x-scroll overflow-y-hidden mr-2 col-span-11 grid items-center'>
                      localhost:8000/api/v1/calendar/ics?u=asjdipoas0ndasuionydasyuidas9yudn
                    </p>
                    <Button size={'icon'}>
                      <ClipboardIcon className='w-6 h-6' />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className='flex items-center gap-2 mb-2'>
                    <ArrowUpTrayIcon className='w-6 h-6' />
                    <p>Export</p>
                  </div>
                  <div className='flex gap-2 flex-wrap'>
                    <Button>Export to ICS</Button>
                    <Button variant={'outline'}>Export to CSV</Button>
                    <Button variant={'outline'}>Export to JSON</Button>
                    <Button variant={'outline'}>Export to TXT</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size={'icon'}
                  variant={'outline'}
                  title='Information about the calendar'
                >
                  <InformationCircleIcon className='w-6 h-6' />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Information</DialogTitle>
                </DialogHeader>
                <div className='flex items-center gap-2'>
                  <IdentificationIcon className='w-6 h-6' />
                  <p>
                    Hosted by: <span className='font-bold'>Medieteknik</span>
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <ClockIcon className='w-6 h-6' />
                  <p>
                    Viewable between:{' '}
                    <span className='font-bold'>
                      {range[0].toLocaleDateString(language, {
                        year: 'numeric',
                        month: 'long',
                      })}{' '}
                      -{' '}
                      {range[1].toLocaleDateString(language, {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </span>
                  </p>
                </div>
                <Separator />
                <div className='flex flex-col gap-4'>
                  <div
                    className='flex items-center gap-2'
                    title='Contact an administrator to gain access'
                  >
                    {permissions.author.includes('EVENT') ? (
                      <CheckIcon className='w-6 h-6 text-green-500' />
                    ) : (
                      <XMarkIcon className='w-6 h-6 text-red-500' />
                    )}
                    <p>
                      You{' '}
                      <span className='font-bold'>
                        {permissions.author.includes('EVENT')
                          ? 'can'
                          : 'cannot'}
                      </span>{' '}
                      host events
                    </p>
                  </div>
                  <div
                    className='flex items-center gap-2'
                    title='Contact an administrator to gain access'
                  >
                    {permissions.student.includes(
                      Permission.CALENDAR_PRIVATE
                    ) ? (
                      <CheckIcon className='w-6 h-6 text-green-500' />
                    ) : (
                      <XMarkIcon className='w-6 h-6 text-red-500' />
                    )}
                    <p>
                      You{' '}
                      <span className='font-bold'>
                        {permissions.student.includes(
                          Permission.CALENDAR_PRIVATE
                        )
                          ? 'can'
                          : 'cannot'}
                      </span>{' '}
                      have a private calendar
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Calendar>
      </div>
      <Dialog open={openEvent} onOpenChange={setOpenEvent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEvent && selectedEvent.translations[0].title}
            </DialogTitle>
            <DialogDescription>Event Information</DialogDescription>
          </DialogHeader>
          <Separator
            style={{
              background:
                (selectedEvent && selectedEvent.background_color) || 'inherit',
            }}
          />
          <div className='flex flex-col gap-2 overflow-hidden'>
            <div className='flex items-center gap-2'>
              <Bars3CenterLeftIcon className='w-6 h-6' />
              <p className='truncate max-w-[400px]'>
                {(selectedEvent &&
                  selectedEvent.translations[0].description) || (
                  <span className='text-neutral-600'>No description</span>
                )}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <ClockIcon className='w-6 h-6' />
              <p>
                {selectedEvent &&
                  new Date(selectedEvent.start_date).toLocaleDateString(
                    language,
                    {
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    }
                  )}
                <span className='font-bold'>{' - '}</span>
                {selectedEvent &&
                  new Date(selectedEvent.end_date).toLocaleDateString(
                    language,
                    {
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    }
                  )}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <MapPinIcon className='w-6 h-6' />
              <p>{selectedEvent && selectedEvent.location}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
