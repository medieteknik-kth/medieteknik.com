'use client'
import { Event } from '@/models/Items'
import Calendar from '@/components/calendar/Calendar'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  ArrowPathRoundedSquareIcon,
  ArrowUpTrayIcon,
  ClipboardIcon,
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
import EventForm from './eventForm'
import { useCalendar } from '@/components/calendar/CalendarProvider'
import Student from '@/models/Student'
import Committee, { CommitteePosition } from '@/models/Committee'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import FallbackIcon from 'public/images/logo.webp'
import Image from 'next/image'
import { StudentTag } from '@/components/tags/StudentTag'
import { CommitteeTag } from '@/components/tags/CommitteeTag'
import useSWR from 'swr'
import { API_BASE_URL } from '@/utility/Constants'
import { Separator } from '@/components/ui/separator'

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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Events({ language }: { language: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedDate, events } = useCalendar()
  const tinycolor = require('tinycolor2')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/students/me`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  )

  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  if (data && data.student_type && !isLoggedIn) {
    setIsLoggedIn(true)
  }

  return (
    <section className='w-full h-fit px-12 py-4'>
      <div>
        <h2 className='uppercase text-neutral-600 dark:text-neutral-400 py-2 text-lg tracking-wide'>
          Events
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
            {isLoggedIn && (
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
            )}
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
                    <XMarkIcon className='w-6 h-6 text-red-500' />
                    <p>
                      You <span className='font-bold'>cannot</span> host events
                    </p>
                  </div>
                  <div
                    className='flex items-center gap-2'
                    title='Contact an administrator to gain access'
                  >
                    <XMarkIcon className='w-6 h-6 text-red-500' />
                    <p>
                      You <span className='font-bold'>cannot</span> have a
                      private calendar
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Calendar>
        <div className='grow lg:mx-40 xl:mx-72 desktop:mx-0 bg-[#111] desktop:ml-4 rounded-xl py-8 text-white'>
          <div className='relative px-6'>
            <h3 className='text-3xl'>Events</h3>
            <p>
              {getNumberWithOrdinal(selectedDate.getDate()) + ' '}
              <span className='capitalize'>
                {selectedDate.toLocaleDateString(language, { month: 'long' })}
              </span>
            </p>
            {isLoggedIn ? (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant={'default'}
                    size={'icon'}
                    className='absolute right-0 top-0 bottom-0 my-auto mr-6'
                    title='Add Event'
                  >
                    <PlusIcon className='w-6 h-6' title='Add Event' />
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className='w-fit'
                  aria-describedby='addEventHeader addEventForm'
                >
                  <DialogHeader id='addEventHeader'>
                    <DialogTitle>Add Event</DialogTitle>
                    <DialogDescription>
                      Add an event to the calendar
                    </DialogDescription>
                  </DialogHeader>
                  <EventForm
                    selectedDate={selectedDate}
                    closeMenuCallback={() => setIsOpen(false)}
                  />
                </DialogContent>
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
                .map((event: Event) => (
                  <div
                    key={event.url}
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
                      <div className='w-fit flex items-center px-2 py-0.5 bg-[#111] font-bold rounded-xl justify-end'>
                        <p>
                          {new Date(event.start_date).toLocaleTimeString(
                            language,
                            {
                              hour: 'numeric',
                              minute: 'numeric',
                            }
                          )}
                        </p>
                        <ClockIcon className='w-6 h-6 ml-1' />
                      </div>
                      <div className='w-fit flex items-center px-2 py-0.5 bg-[#111] font-bold rounded-xl'>
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
                        {event.author.author_type == 'STUDENT' ? (
                          <StudentTag
                            student={event.author as Student}
                            includeAt={false}
                            includeImage={false}
                          />
                        ) : event.author.author_type == 'COMMITTEE' ? (
                          <CommitteeTag committee={event.author as Committee} />
                        ) : (
                          (event.author as CommitteePosition).translations[0]
                            .title
                        )}
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
                            {event.author.author_type == 'STUDENT'
                              ? (event.author as Student).first_name
                              : event.author.author_type == 'COMMITTEE'
                              ? (event.author as Committee).translations[0]
                                  .title
                              : (event.author as CommitteePosition)
                                  .translations[0].title}
                          </AvatarFallback>
                        </Avatar>
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
