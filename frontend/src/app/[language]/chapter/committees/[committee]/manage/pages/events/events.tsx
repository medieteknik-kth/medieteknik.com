'use client'

import EventTable from '@/app/[language]/chapter/committees/[committee]/manage/pages/events/eventTable'
import { useTranslation } from '@/app/i18n/client'
import EventUpload from '@/components/dialogs/EventUpload'
import Loading from '@/components/tooltips/Loading'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { LanguageCode } from '@/models/Language'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import { BookOpenIcon } from '@heroicons/react/24/outline'
import { useEffect, useState, type JSX } from 'react'

interface Props {
  language: LanguageCode
}

/**
 * @name EventPage
 * @description The page for managing a committees events
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 *
 * @returns {JSX.Element} The rendered component
 */
export default function EventPage({ language }: Props): JSX.Element {
  // TODO: Clean-up the code, separate the components into smaller components?
  const {
    total_events,
    isLoading: isLoadingEvents,
    setEventsTotal,
    committee,
  } = useCommitteeManagement()
  const [isLoading, setIsLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const { t } = useTranslation(language, 'committee_management/events')

  useEffect(() => {
    if (!isLoadingEvents) {
      setIsLoading(false)
    }
  }, [isLoadingEvents])

  if (!committee) {
    return <Loading language={language} />
  }

  return (
    <section className='grow'>
      <h2 className='text-2xl py-3 border-b-2 border-yellow-400'>
        {t('title')}
      </h2>
      <div className='flex flex-col mt-4'>
        <div className='flex mb-4'>
          <Card className='w-72 relative'>
            <CardHeader>
              <CardTitle>{t('hosted_events')}</CardTitle>
              <CardDescription>
                <BookOpenIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                {t('hosted_events.description')}
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
                  <Button>{t('create_event')}</Button>
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
        <EventTable language={language} committee={committee} />
      </div>
    </section>
  )
}
