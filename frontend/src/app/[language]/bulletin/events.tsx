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
  MapPinIcon,
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
import { useCalendar } from '@/providers/CalendarProvider'
import Student from '@/models/Student'
import Committee, { CommitteePosition } from '@/models/Committee'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import FallbackIcon from 'public/images/logo.webp'
import Image from 'next/image'
import { StudentTag } from '@/components/tags/StudentTag'
import { CommitteeTag } from '@/components/tags/CommitteeTag'
import { Separator } from '@/components/ui/separator'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import CommitteePositionTag from '@/components/tags/CommitteePositionTag'
import CalendarExport from './components/calendarExport'
import { useTranslation } from '@/app/i18n/client'
import EventUpload from '@/components/dialogs/EventUpload'

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
  const [isOpen, setIsOpen] = useState(false)
  const { selectedDate, events, addEvent } = useCalendar()
  const tinycolor = require('tinycolor2')
  const { student, permissions } = useAuthentication()

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

      <div className='w-full flex flex-col gap-4 desktop:gap-0 justify-around desktop:flex-row relative'>
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
        <div className='grow min-h-[320px] lg:mx-40 xl:mx-72 desktop:mx-0 bg-[#222] dark:bg-[#111] desktop:ml-4 rounded-xl py-8 text-white'>
          <div className='relative px-6'>
            <h3 className='text-3xl tracking-wide'>{t('events')}</h3>
            <p className='text-neutral-300 tracking-widest dark:text-neutral-500'>
              {getNumberWithOrdinal(selectedDate.getDate()) + ' '}
              <span className='capitalize'>
                {selectedDate.toLocaleDateString(language, { month: 'long' })}
              </span>
            </p>
            <Separator className='my-4' />
            {student &&
            permissions.author &&
            permissions.author.includes('EVENT') ? (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger
                  className='w-auto h-[60px] aspect-square'
                  asChild
                >
                  <Button
                    variant={'default'}
                    size={'icon'}
                    className='absolute right-6 top-0 bottom-0 my-auto'
                    title='Add Event'
                  >
                    <PlusIcon className='w-6 h-6' title='Add Event' />
                  </Button>
                </DialogTrigger>
                <EventUpload
                  author={student}
                  language={language}
                  selectedDate={selectedDate}
                  closeMenuCallback={() => setIsOpen(false)}
                  addEvent={addEvent}
                />
              </Dialog>
            ) : null}
          </div>
          <div className='py-4 max-h-[800px] overflow-y-auto mr-3'>
            <div className='flex flex-col gap-4 pl-6 pr-3'>
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
                  <div
                    key={index}
                    className={`w-full h-44 border-l-4 relative`}
                    style={{
                      borderColor: tinycolor(event.background_color).isDark()
                        ? tinycolor(event.background_color)
                            .lighten(10)
                            .toString()
                        : event.background_color,
                    }}
                  >
                    <div className='w-full h-full rounded-r-xl'>
                      {event.translations[0].main_image_url && (
                        <Image
                          src={event.translations[0].main_image_url}
                          alt=''
                        />
                      )}
                    </div>
                    <div className='absolute top-4 right-4 flex flex-col gap-2 items-end z-10'>
                      <div className='w-fit flex items-center px-2 py-0.5 bg-[#222] font-bold rounded-md justify-end'>
                        <p className='text-yellow-200' title='Start time'>
                          {new Date(event.start_date).toLocaleTimeString(
                            language,
                            {
                              hour: 'numeric',
                              minute: 'numeric',
                            }
                          )}
                        </p>
                        <Separator
                          orientation='vertical'
                          className='h-4 mx-2'
                        />
                        <p className='text-fuchsia-200' title='End time'>
                          {new Date(event.end_date).toLocaleTimeString(
                            language,
                            {
                              hour: 'numeric',
                              minute: 'numeric',
                            }
                          )}
                        </p>
                        <ClockIcon className='w-6 h-6 ml-1' />
                      </div>
                      <div className='w-fit flex items-center px-2 py-0.5 bg-[#222] font-bold rounded-md'>
                        <p>{event.location}</p>
                        <MapPinIcon className='w-6 h-6 ml-1' />
                      </div>
                    </div>
                    <div
                      className={`w-full ${
                        event.translations[0].main_image_url
                          ? 'h-fit z-10'
                          : 'h-full rounded-tr-xl'
                      } absolute bottom-0 rounded-br-xl bg-[#323232]`}
                    >
                      <div className='px-2 py-2 sm:max-w-[45%]'>
                        <h3
                          className={`text-2xl font-bold truncate`}
                          title={event.translations[0].title}
                        >
                          {event.translations[0].title}
                        </h3>
                        <p
                          title={event.translations[0].description}
                          className={`truncate ${
                            event.translations[0].description === ''
                              ? 'italic'
                              : 'text-sm'
                          }`}
                        >
                          {event.translations[0].description === ''
                            ? 'No description'
                            : event.translations[0].description}
                        </p>
                      </div>
                      <div className='absolute h-fit bottom-4 right-2 hidden sm:flex justify-end items-center'>
                        {event.author.author_type === 'STUDENT' ? (
                          <StudentTag
                            student={event.author as Student}
                            includeAt={false}
                            includeImage={false}
                          />
                        ) : event.author.author_type === 'COMMITTEE' ? (
                          <CommitteeTag
                            committee={event.author as Committee}
                            includeAt={false}
                            includeBackground={false}
                            includeImage={false}
                          />
                        ) : event.author.author_type ===
                          'COMMITTEE_POSITION' ? (
                          <CommitteePositionTag
                            committeePosition={
                              event.author as CommitteePosition
                            }
                          />
                        ) : null}
                        <Avatar className='mx-2 bg-white'>
                          <AvatarImage
                            src={
                              event.author.author_type == 'STUDENT'
                                ? (event.author as Student)
                                    .profile_picture_url || FallbackIcon.src
                                : (event.author as Committee).logo_url ||
                                  FallbackIcon.src
                            }
                          />
                          <AvatarFallback>
                            <Image
                              src={FallbackIcon}
                              alt='Fallback'
                              width={64}
                              height={64}
                            />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className='absolute left-2 bottom-4 flex items-center'>
                        <div
                          className={`w-4 h-4 rounded-full mr-2 ${
                            new Date(event.end_date) < new Date()
                              ? 'bg-red-500'
                              : new Date(event.end_date) > new Date() &&
                                new Date(event.start_date) < new Date()
                              ? 'bg-green-500'
                              : 'bg-yellow-500'
                          }`}
                        />
                        <p>
                          {new Date(event.end_date) < new Date()
                            ? t('event.ended')
                            : new Date(event.end_date) > new Date() &&
                              new Date(event.start_date) < new Date()
                            ? t('event.ongoing')
                            : t('event.upcoming')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
