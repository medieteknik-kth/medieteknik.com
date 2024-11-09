'use client'

import { useTranslation } from '@/app/i18n/client'
import {
  CompletedEventBadge,
  OngoingEventBadge,
  UpcomingEventBadge,
} from '@/components/badges/Items'
import Loading from '@/components/tooltips/Loading'
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Committee from '@/models/Committee'
import Event from '@/models/items/Event'
import { EventPagniation } from '@/models/Pagination'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import { API_BASE_URL } from '@/utility/Constants'
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { JSX, useState } from 'react'
import useSWR from 'swr'

interface Props {
  language: string
  committee: Committee
}

const fetcher = (url: string) =>
  fetch(url, {
    credentials: 'include',
  }).then((res) => res.json() as Promise<EventPagniation>)

/**
 * @name EventTable
 * @description The table for displaying a committee's events
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 * @param {Committee} props.committee - The committee data
 *
 * @returns {JSX.Element} The rendered component
 */
export default function EventTable({
  language,
  committee,
}: Props): JSX.Element {
  const { total_events, setEventsTotal } = useCommitteeManagement()
  const [pageIndex, setPageIndex] = useState(1)
  const { data: events, error: swrError } = useSWR<EventPagniation>(
    `${API_BASE_URL}/committees/${
      committee && committee.translations[0].title.toLowerCase()
    }/events?language=${language}&page=${pageIndex}`,
    fetcher
  )
  const { t } = useTranslation(language, 'committee_management/events')

  const deleteEvent = async (event: Event) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/events/${event.event_id}?author_type=${event.author.author_type}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ author_email: committee.email }),
        }
      )

      if (response.ok) {
        setEventsTotal(total_events - 1)
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (swrError) {
    console.error(swrError)
    return <p>{swrError.message}</p>
  }

  if (!events) {
    return <Loading language={language} />
  }

  return (
    <Card className='relative'>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          <CalendarDaysIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
          {t('all_events')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='w-fit mb-4'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  className='w-10 h-10'
                  size={'icon'}
                  disabled={pageIndex === 1}
                  onClick={() => {
                    setPageIndex((prev) => (prev - 1 > 0 ? prev - 1 : 1))
                  }}
                >
                  <ChevronLeftIcon className='w-6 h-6' />
                </Button>
              </PaginationItem>
              {Array.from(
                { length: events.total_pages ? events.total_pages : 1 },
                (_, i) => i + 1
              ).map((page) => (
                <PaginationItem key={page}>
                  <Button
                    variant='ghost'
                    className='w-10 h-10'
                    size={'icon'}
                    disabled={pageIndex === page}
                    onClick={() => setPageIndex(page)}
                  >
                    {page}
                  </Button>
                </PaginationItem>
              ))}
              <PaginationItem>
                <Button
                  className='w-10 h-10'
                  size={'icon'}
                  disabled={
                    pageIndex === events.total_pages || !events.total_pages
                  }
                  onClick={() => {
                    setPageIndex((prev) =>
                      prev + 1 > events.total_pages
                        ? events.total_pages
                        : prev + 1
                    )
                  }}
                >
                  <ChevronRightIcon className='w-6 h-6' />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='max-w-52'>{t('table.title')}</TableHead>
              <TableHead className='w-36'>{t('table.status')}</TableHead>
              <TableHead className='max-w-96'>{t('table.location')}</TableHead>
              <TableHead className='w-36'>{t('table.start_date')}</TableHead>
              <TableHead className='w-36'>{t('table.end_date')}</TableHead>
              <TableHead className='text-right w-48'>
                {t('table.actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.items &&
              events.items.map((event, index) => (
                <TableRow key={index}>
                  <TableCell className='max-w-52'>
                    {event.translations[0].title}
                  </TableCell>
                  <TableCell className='w-36'>
                    {new Date(
                      new Date(event.start_date).getTime() +
                        event.duration * 60000
                    ) < new Date() ? (
                      <CompletedEventBadge language={language} />
                    ) : new Date(
                        new Date(event.start_date).getTime() +
                          event.duration * 60000
                      ) > new Date() &&
                      new Date(event.start_date) < new Date() ? (
                      <OngoingEventBadge language={language} />
                    ) : (
                      <UpcomingEventBadge language={language} />
                    )}
                  </TableCell>
                  <TableCell className='max-w-96'>{event.location}</TableCell>
                  <TableCell className='w-72'>
                    {new Date(event.start_date).toLocaleDateString(language, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className='w-72'>
                    {new Date(
                      new Date(event.start_date).getTime() +
                        event.duration * 60000
                    ).toLocaleDateString(language, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
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
                          <AlertDialogCancel>
                            {t('event.cancel')}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              deleteEvent(event)
                            }}
                          >
                            {t('event.delete_confirm')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
