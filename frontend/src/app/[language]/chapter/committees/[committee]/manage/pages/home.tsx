'use client'
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
import { Skeleton } from '@/components/ui/skeleton'
import Committee from '@/models/Committee'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import {
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  DocumentDuplicateIcon,
  NewspaperIcon,
  PhotoIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

/**
 * @name HomePage
 * @description The home page for the committee management
 *
 * @param {string} language - The language of the page
 * @param {Committee} committee - The committee to manage
 * @returns {JSX.Element} The rendered component
 */
export default function HomePage({
  language,
  committee,
}: {
  language: string
  committee: Committee
}): JSX.Element {
  // TODO: Clean-up the code, separate the components into smaller components?
  const [isLoading, setIsLoading] = useState(true)
  const [openModal, setOpenModal] = useState([false, false, false])
  const {
    members,
    total_news,
    total_documents,
    total_events,
    total_media,
    setEventsTotal,
    setDocumentsTotal,
    isLoading: isLoadingCommittee,
  } = useCommitteeManagement()

  const handleOpenModal = (index: number, open: boolean) => {
    setOpenModal((prev) => {
      const newModal = [...prev]
      newModal[index] = open
      return newModal
    })
  }

  useEffect(() => {
    if (!isLoadingCommittee) {
      setIsLoading(false)
    }
  }, [isLoadingCommittee])

  return (
    <section className='grow w-full'>
      <h2 className='text-2xl py-3 border-b-2 border-yellow-400'>Home</h2>
      <div className='flex flex-col'>
        <div className='h-fit flex flex-wrap mt-4 mb-4 gap-4'>
          <Card className='w-64 relative'>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                <UsersIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Total Active Students
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className='w-32 h-8' />
              ) : (
                <p className='text-2xl'>{members.total_items}</p>
              )}
            </CardContent>
          </Card>
          <Card className='w-64 relative'>
            <CardHeader>
              <CardTitle>News Articles</CardTitle>
              <CardDescription>
                <NewspaperIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Total Articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className='w-32 h-8' />
              ) : (
                <p className='text-2xl'>{total_news}</p>
              )}
            </CardContent>
          </Card>
          <Card className='w-64 relative'>
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>
                <CalendarDaysIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Total Events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className='w-32 h-8' />
              ) : (
                <p className='text-2xl'>{total_events}</p>
              )}
            </CardContent>
          </Card>
          <Card className='w-64 relative'>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                <DocumentDuplicateIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Total Documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className='w-32 h-8' />
              ) : (
                <p className='text-2xl'>{total_documents}</p>
              )}
            </CardContent>
          </Card>
          <Card className='w-64 relative'>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>
                <PhotoIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Total Media
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className='w-32 h-8' />
              ) : (
                <p className='text-2xl'>{total_media}</p>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className='w-fit relative'>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                <ArrowTopRightOnSquareIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Create news articles, events, or upload documents!
              </CardDescription>
            </CardHeader>
            <CardContent className='flex gap-4'>
              <Dialog
                open={openModal[0]}
                onOpenChange={(open) => handleOpenModal(0, open)}
              >
                <DialogTrigger asChild>
                  <Button>Create a News Article</Button>
                </DialogTrigger>
                <NewsUpload language={language} author={committee} />
              </Dialog>
              <Dialog
                open={openModal[1]}
                onOpenChange={(open) => handleOpenModal(1, open)}
              >
                <DialogTrigger asChild>
                  <Button variant={'secondary'}>Create an Event</Button>
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
                  <Button variant={'secondary'}>Upload Documents</Button>
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
                  <Button variant={'outline'}>Upload Media</Button>
                </DialogTrigger>
                <MediaUpload language={language} author={committee} />
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
