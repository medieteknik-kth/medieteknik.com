'use client'
import Link from 'next/link'
import { useState } from 'react'

import { ClockIcon, MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function CalendarTooltip({
  title,
  description,
  startDate,
  endDate,
  location,
  link,
  closeCallback,
}: {
  title: string
  description?: string
  startDate: Date
  endDate: Date
  location: string
  link: string
  closeCallback: () => void
}): JSX.Element {
  description = description ?? title

  // Create ICS file
  //const icsFile = `BEGIN:VCALENDAR
  //  VERSION:2.0
  //  BEGIN:VEVENT
  //  URL:${link}
  //  DTSTART:${startDate.toISOString().replace(/-|:|\.\d+/g, '')}
  //  DTEND:${endDate.toISOString().replace(/-|:|\.\d+/g, '')}
  //  SUMMARY:${title}
  //  DESCRIPTION:${description}
  //  LOCATION:${location}
  //  END:VEVENT
  //  END:VCALENDAR`

  //TODO: Upload ICS file

  return (
    <div className='w-full h-full fixed top-0 left-0 bg-black/50 z-50'>
      <div className='w-[500px] h-[450px] fixed border-2 border-black bg-white top-40 right-0 left-0 m-auto z-40 rounded-xl'>
        <div className='w-full h-fit flex items-center justify-between'>
          <h1 className='text-2xl font-bold uppercase py-2 px-10'>
            Add to Calendar
          </h1>
          <button className='w-10 h-10' onClick={() => closeCallback()}>
            <XMarkIcon className='w-6 h-6' />
          </button>
        </div>
        <div className='w-full h-1/3 bg-[#111] text-white flex flex-col justify-evenly px-10'>
          <h2 className='text-xl'>{decodeURIComponent(title)}</h2>
          <div className='w-full flex items-center'>
            <ClockIcon className='w-6 h-6 mr-2' />
            <div className='text-sm'>
              <p>
                {startDate.toDateString() +
                  ' | ' +
                  startDate.toLocaleTimeString()}
              </p>
              <p>
                {endDate.toDateString() + ' | ' + endDate.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className='w-full flex items-center'>
            <MapPinIcon className='w-6 h-6 mr-2' />
            <p className='text-sm'>{location}</p>
          </div>
        </div>
        <div className='w-full h-1/2 flex flex-col justify-center px-10'>
          <Link
            href={`https://outlook.live.com/owa/?path=/calendar/action/compose&subject=${encodeURIComponent(
              title
            )}&startdt=${startDate}&enddt=${endDate}&body=${encodeURIComponent(
              description
            )}&location=${encodeURIComponent(location)}`}
            rel='nofollow noreferrer noopener'
            target='_blank'
            className='w-2/3 h-1/4 text-center bg-white rounded-xl hover:bg-gray-300'
          >
            <div className='h-full flex items-center'>
              <div className='w-10 h-10 rounded-full bg-black ml-2 mr-4' />
              <p className='uppercase text-lg tracking-wide'>Outlook</p>
            </div>
          </Link>
          <div className='w-2/3 h-1/4 text-center bg-white rounded-xl hover:bg-gray-300'>
            <div className='h-full flex items-center'>
              <div className='w-10 h-10 rounded-full bg-black ml-2 mr-4' />
              <p className='uppercase text-lg tracking-wide'>Apple TBA</p>
            </div>
          </div>
          <Link
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
              title
            )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
              description
            )}&location=${encodeURIComponent(location)}&sf=true&output=xml`}
            rel='nofollow noreferrer noopener'
            target='_blank'
            className='w-2/3 h-1/4 text-center bg-white rounded-xl hover:bg-gray-300'
          >
            <div className='h-full flex items-center'>
              <div className='w-10 h-10 rounded-full bg-black ml-2 mr-4' />
              <p className='uppercase text-lg tracking-wide'>Google</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
