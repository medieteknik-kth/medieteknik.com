'use client';
import { useTranslation } from '@/app/i18n/client'
import CommitteePositionTag from '@/components/tags/CommitteePositionTag'
import { CommitteeTag } from '@/components/tags/CommitteeTag'
import { StudentTag } from '@/components/tags/StudentTag'
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
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import Committee, { CommitteePosition } from '@/models/Committee'
import { Event } from '@/models/Items'
import Student from '@/models/Student'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { useCalendar } from '@/providers/CalendarProvider'
import { API_BASE_URL } from '@/utility/Constants'
import { ClockIcon, MapPinIcon, TrashIcon } from '@heroicons/react/24/outline'

import type { JSX } from "react";

const Status = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  ENDED: 'ENDED',
} as const

type Status = (typeof Status)[keyof typeof Status]

function determineEventStatus(event: Event): Status {
  const start_date = new Date(event.start_date)
  const end_date = new Date(start_date.getTime() + event.duration * 60000)

  if (end_date < new Date()) {
    return Status.ENDED
  } else if (start_date < new Date() && end_date > new Date()) {
    return Status.ONGOING
  }
  return Status.UPCOMING
}

interface Props {
  language: string
  event: Event
  closeDialog: () => void
}

/**
 * @name DetailedEvent
 * @description This component is used to display a detailed event.
 *
 * @param {Props} props
 * @param {string} props.language - The language of the event
 * @param {Event} props.event - The event to display
 * @param {() => void} props.closeDialog - The function to close the dialog
 *
 * @returns {JSX.Element} The detailed event component
 */
export default function DetailedEvent({
  language,
  event,
  closeDialog,
}: Props): JSX.Element {
  const { t } = useTranslation(language, 'bulletin')
  const { student, committees, role } = useAuthentication()
  const { removeEvent } = useCalendar()

  const canDelete = () => {
    if (role === 'ADMIN') return true
    if (event.author.author_type === 'STUDENT') {
      if (!student) return false
      return student.email === event.author.email
    } else if (event.author.author_type === 'COMMITTEE') {
      return committees.find((c) => c.email === event.author.email)
    } else {
      return false
    }
  }

  const deleteEvent = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/events/${event.event_id}?author_type=${event.author.author_type}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ author_email: event.author.email }),
        }
      )

      if (response.ok) {
        removeEvent(event)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{event.translations[0].title}</DialogTitle>

        <DialogDescription className='whitespace-pre-line'>
          {event.translations[0].description
            ? event.translations[0].description
            : 'No description available'}
        </DialogDescription>
      </DialogHeader>
      <Separator
        style={{
          backgroundColor: event.background_color,
        }}
      />
      <div className='flex flex-col gap-1'>
        <div className='flex justify-between items-center'>
          <div className='w-fit flex items-center justify-end'>
            <ClockIcon className='w-6 h-6 mr-1' />
            <p
              title={`Event starts: ${new Date(
                event.start_date
              ).toLocaleTimeString(language, {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              })}`}
            >
              {new Date(event.start_date).toLocaleTimeString(language, {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              })}
            </p>
            <span> &nbsp;-&nbsp; </span>
            <p
              title={`Event Ends: ${new Date(
                new Date(event.start_date).getTime() + event.duration * 60000
              ).toLocaleTimeString(language, {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              })}`}
            >
              {new Date(
                new Date(event.start_date).getTime() + event.duration * 60000
              ).toLocaleTimeString(language, {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              })}
            </p>
          </div>
          <div className='flex items-center'>
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                determineEventStatus(event) === 'UPCOMING'
                  ? 'bg-yellow-500'
                  : determineEventStatus(event) === 'ONGOING'
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            />
            <p>
              {t(
                `event.${
                  determineEventStatus(event).toLowerCase() as
                    | 'upcoming'
                    | 'ongoing'
                    | 'ended'
                }`
              )}
            </p>
          </div>
        </div>

        <div className='w-fit flex items-center'>
          <MapPinIcon className='w-6 h-6 mr-1' />
          <p>{event.location}</p>
        </div>
      </div>
      <DialogFooter className='flex !justify-between'>
        {event.author.author_type === 'STUDENT' ? (
          <StudentTag student={event.author as Student} includeAt={false} />
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
        {canDelete() && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={'destructive'} size={'icon'}>
                <TrashIcon className='w-6 h-6' />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('event.delete') + event.translations[0].title}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t('event.delete_confirmation')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deleteEvent()
                    closeDialog()
                  }}
                >
                  {t('delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DialogFooter>
    </DialogContent>
  )
}
