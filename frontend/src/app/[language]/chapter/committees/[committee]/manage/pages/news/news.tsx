'use client'

import NewsTable from '@/app/[language]/chapter/committees/[committee]/manage/pages/news/newsTable'
import { useTranslation } from '@/app/i18n/client'
import { NewsUpload } from '@/components/dialogs/NewsUpload'
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
import Committee from '@/models/Committee'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import { BookOpenIcon } from '@heroicons/react/24/outline'
import { useEffect, useState, type JSX } from 'react'

interface Props {
  language: string
  committee: Committee
}

/**
 * @name NewsPage
 * @description The page for managing a committees news articles
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 * @param {Committee} props.committee - The committee data
 *
 * @returns {JSX.Element} The rendered component
 */
export default function NewsPage({ language, committee }: Props): JSX.Element {
  const [isLoading, setIsLoading] = useState(true)
  const { total_news, isLoading: isLoadingNews } = useCommitteeManagement()
  const [openModal, setOpenModal] = useState(false)
  const { t } = useTranslation(language, 'committee_management/news')

  useEffect(() => {
    if (!isLoadingNews) {
      setIsLoading(false)
    }
  }, [isLoadingNews])

  return (
    <section className='grow'>
      <h2 className='text-2xl py-3 border-b-2 border-yellow-400'>
        {t('title')}
      </h2>
      <div className='flex flex-col mt-4'>
        <div className='flex mb-4'>
          <Card className='w-72 relative'>
            <CardHeader>
              <CardTitle>{t('total_news')}</CardTitle>
              <CardDescription>
                <BookOpenIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                {t('total_news.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className='w-32 h-8' />
              ) : (
                <p className='text-2xl'>{total_news}</p>
              )}
            </CardContent>
            <CardFooter>
              <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogTrigger asChild>
                  <Button>{t('create_news')}</Button>
                </DialogTrigger>
                <NewsUpload language={language} author={committee} />
              </Dialog>
            </CardFooter>
          </Card>
        </div>
        <NewsTable language={language} committee={committee} />
      </div>
    </section>
  )
}
