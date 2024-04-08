'use client'
import { useState, useEffect } from 'react'

import BG from 'public/images/kth-landskap.jpg'
import Image, { StaticImageData } from 'next/image'
import CalendarTooltip from '@/components/tooltips/Calendar'
import EventSidebar from './sidebar'

import {
  PlusIcon,
  LinkIcon,
  BellIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline'

export interface Event {
  id: number
  category: string
  startDate: string
  endDate: string
  author: string
  title: string
  image: StaticImageData
}

const TIME_SECONDS = 30
const UPDATE_INTERVAL = 24

const data = [
  {
    id: 0,
    category: 'Administrative',
    startDate: '2024-02-10T09:00:00Z',
    endDate: '2024-02-10T11:00:00Z',
    author: 'Styrelsen',
    title: 'SM #4',
    image: BG,
  },
  {
    id: 1,
    category: 'Social',
    startDate: '2026-06-10T09:00:00Z',
    endDate: '2026-06-10T11:00:00Z',
    author: 'MKM',
    title: 'Fika',
    image: BG,
  },
  {
    id: 2,
    category: 'Educational',
    startDate: '2024-12-12T09:00:00Z',
    endDate: '2024-12-12T11:00:00Z',
    author: 'Studiesocialt',
    title: 'Study Group',
    image: BG,
  },
  {
    id: 3,
    category: 'Social',
    startDate: '2024-11-14T20:00:00Z',
    endDate: '2024-12-16T11:00:00Z',
    author: 'Studiesocialt',
    title: 'Möte',
    image: BG,
  },
  {
    id: 4,
    category: 'Administrative',
    startDate: '2024-04-09T20:00:00Z',
    endDate: '2024-05-20T11:00:00Z',
    author: 'Valberedningen',
    title: 'Val',
    image: BG,
  },
  {
    id: 5,
    category: 'Educational',
    startDate: '2024-07-20T20:00:00Z',
    endDate: '2024-07-20T11:00:00Z',
    author: 'MKM',
    title: 'Lunch',
    image: BG,
  },
  {
    id: 6,
    category: 'Social',
    startDate: '2025-09-20T10:00:00Z',
    endDate: '2025-09-20T11:00:00Z',
    author: 'MKM',
    title: 'Pub',
    image: BG,
  },
  {
    id: 7,
    category: 'Administrative',
    startDate: '2025-02-10T09:00:00Z',
    endDate: '2025-02-10T11:00:00Z',
    author: 'Styrelsen',
    title: 'SM #2',
    image: BG,
  },
  {
    id: 8,
    category: 'Administrative',
    startDate: '2025-06-10T09:00:00Z',
    endDate: '2025-06-10T11:00:00Z',
    author: 'Styrelsen',
    title: 'SM #3',
    image: BG,
  },
  {
    id: 9,
    category: 'Administrative',
    startDate: '2025-11-10T09:00:00Z',
    endDate: '2025-11-10T11:00:00Z',
    author: 'Styrelsen',
    title: 'SM #4',
    image: BG,
  },
]

export default function Events({
  params: { language },
}: {
  params: { language: string }
}) {
  const highlightedEvent = [...data]
    .sort(
      (a, b) =>
        new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf()
    )
    .slice(0, 3)
  const nonHighlightedEvents = [...data]
    .sort(
      (a, b) =>
        new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf()
    )
    .slice(3)
  const [currentEvent, setCurrentEvent] = useState(highlightedEvent[0])
  const [currentTime, setCurrentTime] = useState(0)
  const [showCalendarPopup, setShowCalendarPopup] = useState([
    false,
    currentEvent,
  ])

  const toNext = () => {
    const nextIndex = (currentEvent.id + 1) % highlightedEvent.length

    setCurrentEvent(highlightedEvent[nextIndex])
    setCurrentTime(0)
  }

  const toBack = () => {
    const prevIndex =
      (currentEvent.id - 1 + highlightedEvent.length) % highlightedEvent.length
    setCurrentEvent(highlightedEvent[prevIndex])
    setCurrentTime(0)
  }

  useEffect(() => {
    const timeInterval = window.setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= TIME_SECONDS * 1000) {
          toNext()
          return 0
        }

        return prev + UPDATE_INTERVAL
      })
    }, UPDATE_INTERVAL) as unknown as number

    return () => {
      window.clearInterval(timeInterval)
    }
  }, [currentEvent])

  return (
    <section className='w-full h-fit px-12 mt-20'>
      <h1 className='uppercase text-3xl font-bold tracking-wider mb-4'>
        Upcoming Events
      </h1>
      {showCalendarPopup[0] && typeof showCalendarPopup[1] !== 'boolean' && (
        <CalendarTooltip
          title={encodeURIComponent(showCalendarPopup[1].title)}
          startDate={new Date(showCalendarPopup[1].startDate)}
          endDate={new Date(showCalendarPopup[1].endDate)}
          link='asd ds'
          location='asd asd'
          closeCallback={() =>
            setShowCalendarPopup([false, showCalendarPopup[1]])
          }
        />
      )}
      <div className='w-full h-[720px] flex'>
        <div className='w-3/4 h-full relative z-10'>
          <div className='w-full h-full relative -z-20 rounded-l-xl overflow-hidden'>
            <div className='w-full h-full absolute bg-black/50' />
            <Image
              src={currentEvent.image}
              width={1080}
              height={720}
              alt=''
              priority
              loading='eager'
              className='w-auto 2xl:w-full h-full 2xl:h-auto object-cover -z-20 absolute top-0 left-0 right-0 bottom-0 m-auto'
            />
            <div className='w-full h-1.5 absolute bottom-0 bg-white/50 z-10' />
            <div
              className='w-full h-1.5 absolute bottom-0 bg-yellow-400 z-20'
              style={{
                width: (currentTime / (TIME_SECONDS * 1000)) * 100 + '%',
              }}
            />
          </div>
          <div className='w-1/3 min-w-72 h-1/4 bg-white absolute bottom-10 left-20 rounded-xl px-10 border-b-2 border-r-2 border-gray-300 shadow-sm shadow-gray-300'>
            <div className='w-full h-10 mt-4 flex items-center justify-between'>
              <div className='flex items-center'>
                <p className='w-fit h-fit bg-black text-white text-center px-2 py-1 rounded-xl text-sm'>
                  {currentEvent.category}
                </p>
              </div>
            </div>
            <h2 className='h-16 max-h-16 overflow-hidden text-2xl font-bold mb-2'>
              {currentEvent.title}
            </h2>
            <div className='flex items-center relative'>
              <div className='w-8 h-8 border-2 absolute border-black rounded-full' />
              <p className='ml-10 text-sm uppercase tracking-wide lg:max-w-36 xl:max-w-60 2xl:max-w-36 desktop:max-w-fit truncate'>
                {currentEvent.author}
              </p>
            </div>
          </div>
          <div className='w-24 h-24 bg-white absolute top-10 right-[120px] flex flex-col justify-evenly rounded-xl border-b-2 border-r-2 border-gray-300 shadow-sm shadow-gray-300'>
            <p className='text-center text-4xl font-bold'>
              {new Date(currentEvent.startDate).getDay()}
            </p>
            <p className='text-center text-lg uppercase tracking-wider'>
              {new Date(currentEvent.startDate).toLocaleString(undefined, {
                month: 'short',
              })}
            </p>
          </div>
          <div className='w-44 h-10 bg-white absolute bottom-10 right-20 rounded-full flex border-b-2 border-r-2 border-gray-300 shadow-sm shadow-gray-300'>
            <button
              className='w-fit h-fit m-auto'
              onClick={() => {
                setShowCalendarPopup([true, currentEvent])
              }}
              title='Add to Calendar'
              aria-label='Add to Calendar'
            >
              <PlusIcon className='w-6 h-6 m-auto hover:bg-black/25 rounded-xl hover:cursor-pointer' />
            </button>

            <LinkIcon
              className='w-6 h-6 m-auto hover:bg-black/25 rounded-xl hover:cursor-pointer'
              title='Share'
            />
            <BellIcon
              className='w-6 h-6 m-auto hover:bg-black/25 rounded-xl hover:cursor-pointer'
              title='Notify Me'
            />
          </div>
          <div className='w-full h-8 absolute bottom-2 grid place-items-center -z-10'>
            <ul className='grid grid-cols-4 grid-rows-1 gap-2'>
              {highlightedEvent.map((item, index) => (
                <li
                  key={index}
                  className={`w-4 h-4 border-2 rounded-full border-black ${
                    currentEvent.id == item.id
                      ? 'bg-white'
                      : 'bg-black hover:cursor-pointer'
                  }`}
                  onClick={() => {
                    if (currentEvent.id != item.id) {
                      setCurrentTime(0)
                      setCurrentEvent(item)
                    }
                  }}
                />
              ))}
            </ul>
          </div>

          <div className='w-full h-full absolute flex justify-between left-0 top-0 -z-20 text-white'>
            <div
              className='w-fit h-full px-4 hover:bg-white/25 hover:cursor-pointer rounded-l-xl'
              onClick={() => {
                toBack()
              }}
            >
              <ChevronLeftIcon className='w-8 h-full' />
            </div>

            <div
              className='w-fit h-full px-4 hover:bg-white/25 hover:cursor-pointer rounded-r-xl'
              onClick={() => {
                toNext()
              }}
            >
              <ChevronRightIcon className='w-8 h-full' />
            </div>
          </div>
        </div>

        <EventSidebar params={{ language, nonHighlightedEvents }} />
      </div>
    </section>
  )
}
