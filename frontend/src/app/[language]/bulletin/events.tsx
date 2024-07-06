'use client'
import { Event } from '@/models/Items'
import Calendar from '@/components/calendar/Calendar'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ClockIcon, MapPinIcon, PlusIcon } from '@heroicons/react/24/outline'
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
import Committee from '@/models/Committee'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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

export default function Events({ language }: { language: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedDate, events } = useCalendar()
  return (
    <section className='w-full h-fit px-12 py-4'>
      <div>
        <h2 className='uppercase text-neutral-600 dark:text-neutral-400 py-2 text-lg tracking-wide'>
          Events
        </h2>
        <p className='text-lg'>
          {new Date().toLocaleDateString(language, {
            year: 'numeric',
            month: 'long',
          })}
        </p>
      </div>
      <div className='w-full flex flex-col gap-4 desktop:gap-0 justify-around desktop:flex-row'>
        <Calendar />
        <div className='grow bg-[#111] desktop:ml-4 rounded-xl px-6 py-8 text-white'>
          <div className='relative'>
            <h3 className='text-3xl'>Events</h3>
            <p>
              {getNumberWithOrdinal(selectedDate.getDate()) + ' '}
              <span className='capitalize'>
                {selectedDate.toLocaleDateString(language, { month: 'long' })}
              </span>
            </p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant={'default'}
                  size={'icon'}
                  className='absolute right-0 top-0 bottom-0 my-auto'
                  title='Add Event'
                >
                  <PlusIcon className='w-6 h-6' />
                </Button>
              </DialogTrigger>
              <DialogContent className='w-fit'>
                <DialogHeader>
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
          </div>
          <div className='flex flex-col gap-4 py-4'>
            {events
              .filter((event) => {
                return (
                  new Date(event.start_date).toDateString() ===
                  selectedDate.toDateString()
                )
              })
              .map((event: Event) => (
                <div
                  key={event.url}
                  className={`w-full h-44 border-l-4 relative`}
                  style={{
                    borderColor: event.background_color,
                  }}
                >
                  <div className='w-full h-full bg-white rounded-r-xl' />
                  <div className='absolute top-4 right-4 flex flex-col gap-2 items-end'>
                    <div className='w-fit flex items-center px-1.5 py-0.5 bg-[#111] font-bold rounded-xl justify-end'>
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
                    <div className='w-fit flex items-center px-1.5 py-0.5 bg-[#111] font-bold rounded-xl'>
                      <p>{event.location}</p>
                      <MapPinIcon className='w-6 h-6 ml-1' />
                    </div>
                  </div>
                  <div className='z-10 w-full h-fit bg-black/75 absolute bottom-0 rounded-br-xl '>
                    <div className='px-2 py-2 max-w-[45%]'>
                      <h3 className='text-2xl font-bold  truncate'>
                        {event.translations[0].title}
                      </h3>
                      <p
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
                    <div className='absolute h-full right-0 top-0 flex justify-end items-center'>
                      <p>
                        {event.author.author_type == 'STUDENT'
                          ? (event.author as Student).first_name +
                            ' ' +
                            (event.author as Student).last_name
                          : event.author.author_type == 'COMMITTEE'
                          ? (event.author as Committee).translations[0].title
                          : ''}
                      </p>
                      <Avatar className='mx-2'>
                        <AvatarImage
                          src={
                            event.author.author_type == 'STUDENT'
                              ? (event.author as Student).profile_picture_url
                              : event.author.author_type == 'COMMITTEE'
                              ? (event.author as Committee).logo_url
                              : ''
                          }
                        />
                        <AvatarFallback>
                          {event.author.author_type == 'STUDENT'
                            ? (event.author as Student).first_name
                            : event.author.author_type == 'COMMITTEE'
                            ? (event.author as Committee).translations[0].title
                            : ''}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
