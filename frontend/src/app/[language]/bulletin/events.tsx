'use client'
import { Event } from '@/models/Items'
import Calendar from '@/components/calendar/Calendar'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  CheckIcon,
  ClockIcon,
  IdentificationIcon,
  InformationCircleIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useCalendar } from '@/providers/CalendarProvider'
import { Separator } from '@/components/ui/separator'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import CalendarExport from './components/calendarExport'
import { useTranslation } from '@/app/i18n/client'
import EventUpload from '@/components/dialogs/EventUpload'
import EventDialog from './components/eventDialog'

/**
 * Get the ordinal suffix for a given number
 *
 * @param {number} number - The number to get the ordinal suffix for
 * @returns {string} The ordinal suffix for the given number
 */
function getNumberWithOrdinal(number: number): string {
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

/**
 * Render the events section of the bulletin
 * @name Events
 * @description Renders the event section of the bulletin.
 *
 * @param {string} language - The language of the page
 * @returns {JSX.Element} The events section
 */
export default function Events({
  language,
}: {
  language: string
}): JSX.Element {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const { selectedDate, events, addEvent } = useCalendar()
  const { student, permissions, role } = useAuthentication()

  const { t } = useTranslation(language, 'bulletin')

  return (
    <section className='w-full h-fit py-4'>
      <div>
        <h2 className='uppercase text-neutral-600 dark:text-neutral-400 py-2 text-lg tracking-wide'>
          {t('events')}
        </h2>
        <p className='text-lg mb-3'>
          {new Date().toLocaleDateString(language, {
            year: 'numeric',
            month: 'long',
          })}
        </p>
      </div>

      <div className='w-full flex flex-col gap-4 desktop:flex-row relative'>
        <Calendar>
          <div className='absolute right-0 -top-12 flex gap-2'>
            {student && <CalendarExport student={student} />}
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
                  <DialogDescription>Calendar Information</DialogDescription>
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
                    Viewable only:{' '}
                    <span className='font-bold'>
                      {new Date().toLocaleDateString(language, {
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
                    {permissions.author &&
                    permissions.author.includes('EVENT') ? (
                      <CheckIcon className='w-6 h-6 text-green-500' />
                    ) : (
                      <XMarkIcon className='w-6 h-6 text-red-500' />
                    )}
                    <p>
                      You{' '}
                      <span className='font-bold'>
                        {permissions.author &&
                        permissions.author.includes('EVENT')
                          ? 'can'
                          : 'cannot'}
                      </span>{' '}
                      host events
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Calendar>
        <Card className='grow min-h-[320px] dark:bg-[#111]'>
          <CardHeader className='relative'>
            <CardTitle>{t('events')}</CardTitle>
            <CardDescription>
              {getNumberWithOrdinal(selectedDate.getDate()) + ' '}
              <span className='capitalize'>
                {selectedDate.toLocaleDateString(language, { month: 'long' })}
              </span>
            </CardDescription>
            {student &&
              permissions.author &&
              permissions.author.includes('EVENT') && (
                <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant={'default'}
                      size={'icon'}
                      className='absolute right-6'
                      title='Add Event'
                    >
                      <PlusIcon className='w-6 h-6' title='Add Event' />
                    </Button>
                  </DialogTrigger>
                  {isCalendarOpen && (
                    <EventUpload
                      author={student}
                      language={language}
                      selectedDate={selectedDate}
                      closeMenuCallback={() => setIsCalendarOpen(false)}
                      addEvent={addEvent}
                    />
                  )}
                </Dialog>
              )}
          </CardHeader>

          <div className='max-h-[800px] overflow-y-auto px-4'>
            <ul className='w-full grid grid-cols-2 gap-4'>
              {events
                .filter((event) => {
                  return (
                    new Date(event.start_date).toDateString() ===
                    selectedDate.toDateString()
                  )
                })
                .sort(
                  (a, b) =>
                    new Date(a.start_date).getTime() -
                    new Date(b.start_date).getTime()
                )
                .map((event: Event, index) => (
                  <li key={index}>
                    <EventDialog
                      language={language}
                      event={event}
                      index={index}
                    />
                  </li>
                ))}
            </ul>
          </div>
        </Card>
      </div>
    </section>
  )
}
