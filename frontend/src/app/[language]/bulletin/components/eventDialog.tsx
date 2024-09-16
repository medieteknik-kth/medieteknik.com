'use client'
import { Event } from '@/models/Items'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ClockIcon, MapPinIcon, TrashIcon } from '@heroicons/react/24/outline'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Student from '@/models/Student'
import Committee, { CommitteePosition } from '@/models/Committee'
import { StudentTag } from '@/components/tags/StudentTag'
import { CommitteeTag } from '@/components/tags/CommitteeTag'
import { Separator } from '@/components/ui/separator'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import CommitteePositionTag from '@/components/tags/CommitteePositionTag'
import { useTranslation } from '@/app/i18n/client'
import { API_BASE_URL } from '@/utility/Constants'
import { useCalendar } from '@/providers/CalendarProvider'
import DetailedEvent from './detailedEvent'

interface Props {
  language: string
  event: Event
  index: number
}

export default function EventDialog({
  language,
  event,
  index,
}: Props): JSX.Element {
  const tinycolor = require('tinycolor2')
  const [isEventOpen, setIsEventOpen] = useState<boolean[]>([false])

  return (
    <Dialog
      open={isEventOpen[index]}
      onOpenChange={(isOpen) => {
        const newIsEventOpen = [...isEventOpen]
        newIsEventOpen[index] = isOpen
        setIsEventOpen(newIsEventOpen)
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          className={`w-full border-l-4 border-2 h-fit`}
          title='Click to view event details'
          style={{
            borderColor: tinycolor(event.background_color).isDark()
              ? tinycolor(event.background_color).lighten(10).toString()
              : event.background_color,
          }}
        >
          <div className={`w-full flex flex-col gap-2`}>
            <div className='flex flex-col px-2 py-2'>
              <h3
                className={`text-2xl font-bold text-start max-w-full truncate`}
                title={event.translations[0].title}
              >
                {event.translations[0].title}
              </h3>

              <div className='flex flex-col gap-1 text-xs sm:text-sm'>
                <div className='w-fit flex flex-col xs:flex-row items-center justify-end'>
                  <ClockIcon className='w-4 h-4 mr-1 hidden xs:block' />
                  <p
                    title={`Event starts: ${new Date(
                      event.start_date
                    ).toLocaleTimeString(language, {
                      hour: 'numeric',
                      minute: 'numeric',
                    })}`}
                  >
                    {new Date(event.start_date).toLocaleTimeString(language, {
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </p>
                  <span className='hidden xs:block'> &nbsp;-&nbsp; </span>
                  <p
                    title={`Event Ends: ${new Date(
                      new Date(event.start_date).getTime() +
                        event.duration * 60000
                    ).toLocaleTimeString(language, {
                      hour: 'numeric',
                      minute: 'numeric',
                    })}`}
                  >
                    {new Date(
                      new Date(event.start_date).getTime() +
                        event.duration * 60000
                    ).toLocaleTimeString(language, {
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </p>
                </div>
                <div className='w-fit flex items-center'>
                  <MapPinIcon className='w-4 h-4 mr-1 hidden xs:block' />
                  <p>{event.location}</p>
                </div>
              </div>
            </div>

            <div className='h-fit flex justify-start py-2'>
              {event.author.author_type === 'STUDENT' ? (
                <StudentTag
                  student={event.author as Student}
                  includeAt={false}
                />
              ) : event.author.author_type === 'COMMITTEE' ? (
                <CommitteeTag
                  committee={event.author as Committee}
                  includeAt={false}
                  includeBackground={false}
                />
              ) : event.author.author_type === 'COMMITTEE_POSITION' ? (
                <CommitteePositionTag
                  committeePosition={event.author as CommitteePosition}
                />
              ) : null}
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DetailedEvent
        language={language}
        event={event}
        closeDialog={() => {
          const newIsEventOpen = [...isEventOpen]
          newIsEventOpen[index] = false
          setIsEventOpen(newIsEventOpen)
        }}
      />
    </Dialog>
  )
}
