'use client'
import { useState, useEffect, useCallback } from 'react'
import BG from 'public/images/kth-landskap.jpg'
import Image, { StaticImageData } from 'next/image'
import CalendarTooltip from '@/components/tooltips/Calendar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import StyrelsenIcon from 'public/images/committees/styrelsen.png'
import EventPreview from './components/eventPreview'
import { Event } from '@/models/Items'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import {
  PlusIcon,
  LinkIcon,
  BellIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const TIME_SECONDS = 30
const UPDATE_INTERVAL = 24

const data: Event[] = [
  {
    author: {
      type: 'COMMITTEE',
      email: 'styrelsen@medieteknik.com',
      title: 'Styrelsen',
      logo_url: StyrelsenIcon.src,
      description: 'Styrelsen',
    },
    categories: ['Admin'],
    title: 'SM #4',
    created_at: '2021-09-01T00:00:00.000Z',
    main_image_url: BG.src,
    start_date: '2021-09-01T00:00:00.000Z',
    end_date: '2021-09-01T00:00:00.000Z',
    location: 'KTH',
    body: '',
    is_pinned: false,
    is_public: true,
    published_status: 'PUBLISHED',
    short_description: '',
    status: 'UPCOMING',
    url: '1',
  },
  {
    author: {
      type: 'COMMITTEE',
      email: 'styrelsen@medieteknik.com',
      title: 'Styrelsen',
      logo_url: StyrelsenIcon.src,
      description: 'Styrelsen',
    },
    categories: ['Admin'],
    title: 'SM #4',
    created_at: '2021-09-01T00:00:00.000Z',
    main_image_url: BG.src,
    start_date: '2021-09-01T00:00:00.000Z',
    end_date: '2021-09-01T00:00:00.000Z',
    location: 'KTH',
    body: '',
    is_pinned: false,
    is_public: true,
    published_status: 'PUBLISHED',
    short_description: '',
    status: 'UPCOMING',
    url: '1',
  },
  {
    author: {
      type: 'COMMITTEE',
      email: 'styrelsen@medieteknik.com',
      title: 'Styrelsen',
      logo_url: StyrelsenIcon.src,
      description: 'Styrelsen',
    },
    categories: ['Admin'],
    title: 'SM #4',
    created_at: '2021-09-01T00:00:00.000Z',
    main_image_url: BG.src,
    start_date: '2021-09-01T00:00:00.000Z',
    end_date: '2021-09-01T00:00:00.000Z',
    location: 'KTH',
    body: '',
    is_pinned: false,
    is_public: true,
    published_status: 'PUBLISHED',
    short_description: '',
    status: 'UPCOMING',
    url: '1',
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
        new Date(a.start_date).valueOf() - new Date(b.start_date).valueOf()
    )
    .slice(0, 3)
  const nonHighlightedEvents = [...data]
    .sort(
      (a, b) =>
        new Date(a.start_date).valueOf() - new Date(b.start_date).valueOf()
    )
    .slice(3)
  const [currentEvent, setCurrentEvent] = useState(highlightedEvent[0])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [copiedLink, setCopiedLink] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showCalendarPopup, setShowCalendarPopup] = useState([
    false,
    currentEvent,
  ])

  const toNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % highlightedEvent.length

    setCurrentEvent(highlightedEvent[nextIndex])
    setCurrentIndex(nextIndex)
    setCurrentTime(0)
  }, [currentEvent, highlightedEvent, currentIndex])

  const toBack = () => {
    const prevIndex =
      (currentIndex - 1 + highlightedEvent.length) % highlightedEvent.length
    setCurrentEvent(highlightedEvent[prevIndex])
    setCurrentIndex(prevIndex)
    setCurrentTime(0)
  }

  useEffect(() => {
    const timeInterval = window.setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= TIME_SECONDS * 1000) {
          toNext()
          return 0
        }

        return isPaused ? prev : prev + UPDATE_INTERVAL
      })
    }, UPDATE_INTERVAL) as unknown as number

    return () => {
      window.clearInterval(timeInterval)
    }
  }, [currentEvent, toNext, isPaused])

  return (
    <section id='upcoming-events' className='w-full h-fit px-12 mt-8'>
      <h1 className='uppercase text-3xl font-bold tracking-wider mb-4'>
        Upcoming Events
      </h1>
      {showCalendarPopup[0] && typeof showCalendarPopup[1] !== 'boolean' && (
        <CalendarTooltip
          title={encodeURIComponent(showCalendarPopup[1].title)}
          startDate={new Date(showCalendarPopup[1].start_date)}
          endDate={new Date(showCalendarPopup[1].end_date)}
          link='asd ds'
          location='asd asd'
          closeCallback={() =>
            setShowCalendarPopup([false, showCalendarPopup[1]])
          }
        />
      )}
      <div className='w-full h-[720px] flex'>
        <div
          className='w-3/4 h-full relative z-10 rounded-bl-xl overflow-hidden'
          onMouseOver={() => {
            setIsPaused(true)
          }}
          onMouseOut={() => {
            setIsPaused(false)
          }}
        >
          <EventPreview language={language} event={currentEvent} />
          <div
            className='w-full h-1.5 absolute bottom-0 bg-yellow-400 z-20'
            style={{
              width: `${(currentTime / (TIME_SECONDS * 1000)) * 100}%`,
            }}
          />

          <Card className='absolute bottom-5 right-24'>
            <CardContent className='p-0'>
              <TooltipProvider>
                <Tooltip open={copiedLink}>
                  <TooltipTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      title='Share'
                      aria-label='Share'
                      className='relative'
                      onClick={(e) => {
                        navigator.clipboard.writeText(
                          window.location.href + `/events/${currentEvent.url}`
                        )

                        setCopiedLink(true)
                        setTimeout(() => {
                          setCopiedLink(false)
                        }, 1000)
                      }}
                    >
                      <TooltipContent>Copied</TooltipContent>

                      <LinkIcon className='w-6 h-6' />
                    </Button>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant='ghost'
                size='icon'
                title='Enable notifications'
                aria-label='Enable notifications'
                onClick={(e) => {
                  //TODO: Implement notification
                  const target = e.currentTarget
                  target.style.color = 'lime'
                  setTimeout(() => {
                    target.style.color = 'black'
                  }, 250)
                }}
              >
                <BellIcon className='w-6 h-6' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                title='Add to calendar'
                aria-label='Add to calendar'
                onClick={(e) => {
                  setShowCalendarPopup([true, currentEvent])
                  const target = e.currentTarget
                  target.style.color = 'lime'
                  setTimeout(() => {
                    target.style.color = 'black'
                  }, 250)
                }}
              >
                <PlusIcon className='w-6 h-6' />
              </Button>
            </CardContent>
          </Card>

          <div>
            <Button
              className='absolute top-1/2 left-4 transform -translate-y-1/2'
              onClick={toBack}
              size='icon'
            >
              <ChevronLeftIcon className='w-6 h-6' />
            </Button>
            <Button
              className='absolute top-1/2 right-4 transform -translate-y-1/2'
              onClick={toNext}
              size='icon'
            >
              <ChevronRightIcon className='w-6 h-6' />
            </Button>
          </div>
        </div>
        <div className='w-1/4 h-full bg-[#111]'></div>
      </div>
    </section>
  )
}
