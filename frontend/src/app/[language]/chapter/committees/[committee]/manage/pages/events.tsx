'use client'
import { Button } from '@/components/ui/button'
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BookOpenIcon,
  CalendarDaysIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  CompletedEventBadge,
  OngoingEventBadge,
  UpcomingEventBadge,
} from '@/components/badges/Items'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import { EventPagniation } from '@/models/Pagination'
import useSWR from 'swr'
import { API_BASE_URL } from '@/utility/Constants'
import Committee from '@/models/Committee'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import EventUpload from '@/components/dialogs/EventUpload'
import { useTranslation } from '@/app/i18n/client'
import { Event } from '@/models/Items'

const fetcher = (url: string) =>
  fetch(url, {
    credentials: 'include',
  }).then((res) => res.json() as Promise<EventPagniation>)

/**
 * @name EventPage
 * @description The page for managing a committees events
 *
 * @param {string} language - The language of the page
 * @returns {JSX.Element} The rendered component
 */
export default function EventPage({
  language,
}: {
  language: string
}): JSX.Element {
  // TODO: Clean-up the code, separate the components into smaller components?
  const {
    total_events,
    isLoading: isLoadingEvents,
    error,
    setEventsTotal,
    committee,
  } = useCommitteeManagement()
  const [pageIndex, setPageIndex] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const { data: events, error: swrError } = useSWR<EventPagniation>(
    `${API_BASE_URL}/committees/${
      committee && committee.translations[0].title.toLowerCase()
    }/events?language=${language}&page=${pageIndex}`,
    fetcher
  )
  const { t } = useTranslation(language, 'committee_management')

  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    if (!isLoadingEvents) {
      setIsLoading(false)
    }
  }, [isLoadingEvents])

  if (!committee) {
    return <p>Loading...</p>
  }

  if (swrError) {
    console.error(swrError)
    return <p>{swrError.message}</p>
  }

  if (!events) {
    return <p>Loading...</p>
  }

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

  return (
    <section className='grow'>
      <h2 className='text-2xl py-3 border-b-2 border-yellow-400'>Events</h2>
      <div className='flex flex-col mt-4'>
        <div className='flex mb-4'>
          <Card className='w-72 relative'>
            <CardHeader>
              <CardTitle>Hosted Events</CardTitle>
              <CardDescription>
                <BookOpenIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Amount of events hosted
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className='w-32 h-8' />
              ) : (
                <p className='text-2xl'>{total_events}</p>
              )}
            </CardContent>
            <CardFooter>
              <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogTrigger asChild>
                  <Button>Create an Event</Button>
                </DialogTrigger>
                <EventUpload
                  language={language}
                  author={committee}
                  closeMenuCallback={() => setOpenModal(false)}
                  addEvent={() => setEventsTotal(total_events + 1)}
                  selectedDate={new Date()}
                />
              </Dialog>
            </CardFooter>
          </Card>
        </div>
        <Card className='relative'>
          <CardHeader>
            <CardTitle>Events</CardTitle>
            <CardDescription>
              <CalendarDaysIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
              All Events (20 per page)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='w-fit mb-4'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href='#'
                      onClick={() =>
                        setPageIndex((prev) => {
                          if (prev > 0) {
                            return prev - 1
                          }
                          return prev
                        })
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: events.total_pages }, (_, i) => (
                    <PaginationItem key={i} onClick={() => setPageIndex(i)}>
                      <PaginationLink href='#' isActive={pageIndex === i}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href='#'
                      onClick={() =>
                        setPageIndex((prev) => {
                          if (prev < events.total_pages - 1) {
                            return prev + 1
                          }
                          return prev
                        })
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='max-w-52'>Title</TableHead>
                  <TableHead className='w-36'>Event Status</TableHead>
                  <TableHead className='max-w-96'>Location</TableHead>
                  <TableHead className='w-36'>Start Date</TableHead>
                  <TableHead className='w-36'>End Date</TableHead>
                  <TableHead className='text-right w-48'>Actions</TableHead>
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
                      <TableCell className='max-w-96'>
                        {event.location}
                      </TableCell>
                      <TableCell className='w-72'>
                        {new Date(event.start_date).toLocaleDateString(
                          language,
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                          }
                        )}
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
                                {t('event.delete') +
                                  event.translations[0].title}
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
      </div>
    </section>
  )
}
