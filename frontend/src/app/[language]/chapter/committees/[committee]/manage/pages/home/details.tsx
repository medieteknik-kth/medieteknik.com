'use client'

import { useTranslation } from '@/app/i18n/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import {
  CalendarDaysIcon,
  DocumentDuplicateIcon,
  NewspaperIcon,
  PhotoIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { JSX, useEffect, useState } from 'react'

interface Props {
  language: string
}

/**
 * @name HomeDetails
 * @description The details section of the home page for the committee management
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 *
 * @returns {JSX.Element} The rendered component
 */
export default function HomeDetails({ language }: Props): JSX.Element {
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation(language, 'committee_management/home')

  const {
    members,
    total_news,
    total_documents,
    total_events,
    total_media,
    isLoading: isLoadingCommittee,
  } = useCommitteeManagement()

  useEffect(() => {
    if (!isLoadingCommittee) {
      setIsLoading(false)
    }
  }, [isLoadingCommittee])

  return (
    <div className='h-fit flex flex-wrap mt-4 mb-4 gap-4'>
      <Card className='w-64 relative'>
        <CardHeader>
          <CardTitle>{t('members')}</CardTitle>
          <CardDescription>
            <UsersIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
            {t('total_members')}
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
          <CardTitle>{t('news')}</CardTitle>
          <CardDescription>
            <NewspaperIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
            {t('total_news')}
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
          <CardTitle>{t('events')}</CardTitle>
          <CardDescription>
            <CalendarDaysIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
            {t('total_events')}
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
          <CardTitle>{t('documents')}</CardTitle>
          <CardDescription>
            <DocumentDuplicateIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
            {t('total_documents')}
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
          <CardTitle>{t('media')}</CardTitle>
          <CardDescription>
            <PhotoIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
            {t('total_media')}
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
  )
}
