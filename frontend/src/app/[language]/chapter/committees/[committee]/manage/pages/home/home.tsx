'use client'

import HomeDetails from '@/app/[language]/chapter/committees/[committee]/manage/pages/home/details'
import { useTranslation } from '@/app/i18n/client'
import DocumentUpload from '@/components/dialogs/DocumentUpload'
import EventUpload from '@/components/dialogs/EventUpload'
import MediaUpload from '@/components/dialogs/MediaUpload'
import { NewsUpload } from '@/components/dialogs/NewsUpload'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import {
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  DocumentDuplicateIcon,
  NewspaperIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'
import { type JSX, useState } from 'react'

interface Props {
  language: LanguageCode
  committee: Committee
}

/**
 * @name HomePage
 * @description The home page for the committee management
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 * @param {Committee} props.committee - The committee data
 *
 * @returns {JSX.Element} The rendered component
 */
export default function HomePage({ language, committee }: Props): JSX.Element {
  // TODO: Clean-up the code, separate the components into smaller components?
  const [openModal, setOpenModal] = useState([false, false, false])
  const { total_documents, total_events, setEventsTotal, setDocumentsTotal } =
    useCommitteeManagement()
  const { t } = useTranslation(language, 'committee_management/home')

  const handleOpenModal = (index: number, open: boolean) => {
    setOpenModal((prev) => {
      const newModal = [...prev]
      newModal[index] = open
      return newModal
    })
  }

  return (
    <section className='grow w-full'>
      <h2 className='text-2xl py-3 border-b-2 border-yellow-400'>
        {t('tab.home')}
      </h2>
      <div className='flex flex-col'>
        <HomeDetails language={language} />
        <div>
          <Card className='w-fit relative'>
            <CardHeader>
              <CardTitle>{t('quick_actions')}</CardTitle>
              <CardDescription>
                <ArrowTopRightOnSquareIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                {t('quick_actions.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-wrap gap-4'>
              <Dialog
                open={openModal[0]}
                onOpenChange={(open) => handleOpenModal(0, open)}
              >
                <DialogTrigger asChild>
                  <Button>
                    <NewspaperIcon className='w-5 h-5 mr-2' />
                    {t('quick_actions.create_news')}
                  </Button>
                </DialogTrigger>
                <NewsUpload language={language} author={committee} />
              </Dialog>
              <Dialog
                open={openModal[1]}
                onOpenChange={(open) => handleOpenModal(1, open)}
              >
                <DialogTrigger asChild>
                  <Button variant={'secondary'}>
                    <CalendarDaysIcon className='w-5 h-5 mr-2' />
                    {t('quick_actions.create_event')}
                  </Button>
                </DialogTrigger>
                <EventUpload
                  language={language}
                  author={committee}
                  closeMenuCallback={() => handleOpenModal(1, false)}
                  addEvent={() => setEventsTotal(total_events + 1)}
                  selectedDate={new Date()}
                />
              </Dialog>
              <Dialog
                open={openModal[2]}
                onOpenChange={(open) => handleOpenModal(2, open)}
              >
                <DialogTrigger asChild>
                  <Button variant={'secondary'}>
                    <DocumentDuplicateIcon className='w-5 h-5 mr-2' />
                    {t('quick_actions.upload_document')}
                  </Button>
                </DialogTrigger>
                <DocumentUpload
                  addDocument={() => setDocumentsTotal(total_documents + 1)}
                  language={language}
                  author={committee}
                  closeMenuCallback={() => handleOpenModal(2, false)}
                />
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={'outline'}>
                    <PhotoIcon className='w-5 h-5 mr-2' />
                    {t('quick_actions.upload_media')}
                  </Button>
                </DialogTrigger>
                <MediaUpload
                  language={language}
                  author={committee}
                  album={null}
                  callback={() => {}}
                />
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
