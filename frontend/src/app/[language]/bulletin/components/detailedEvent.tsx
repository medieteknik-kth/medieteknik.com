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

interface Props {
  language: string
  event: Event
  closeDialog: () => void
}

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
        {event.translations[0].description && (
          <DialogDescription>
            {event.translations[0].description}
          </DialogDescription>
        )}
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
                new Date(event.start_date + event.duration) < new Date()
                  ? 'bg-red-500'
                  : new Date(event.start_date + event.duration) > new Date() &&
                    new Date(event.start_date) < new Date()
                  ? 'bg-green-500'
                  : 'bg-yellow-500'
              }`}
            />
            <p>
              {new Date(event.start_date + event.duration) < new Date()
                ? t('event.ended')
                : new Date(event.start_date + event.duration) > new Date() &&
                  new Date(event.start_date) < new Date()
                ? t('event.ongoing')
                : t('event.upcoming')}
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
