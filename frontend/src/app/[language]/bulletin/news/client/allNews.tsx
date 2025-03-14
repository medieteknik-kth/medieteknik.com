'use client'

import ExtraNewsCard from '@/app/[language]/bulletin/components/extraNewsCard'
import NewsPaginationPage from '@/app/[language]/bulletin/news/client/pagination'
import { NewsUpload } from '@/components/dialogs/NewsUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import type { LanguageCode } from '@/models/Language'
import type { NewsPagination } from '@/models/Pagination'
import { usePermissions, useStudent } from '@/providers/AuthenticationProvider'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { type JSX, useState } from 'react'

interface Props {
  language: LanguageCode
  data: NewsPagination
}

/**
 * @name AllNews
 * @description This component is used to display all the news.
 *
 * @param {Props} props
 * @param {string} props.language - The language of the news
 * @param {NewsPagination} props.data - The news pagination data
 *
 * @returns {JSX.Element} The all news component
 */
export default function AllNews({ language, data }: Props): JSX.Element {
  const { student } = useStudent()
  const { permissions } = usePermissions()
  const [pageIndex, setPageIndex] = useState(1)

  return (
    <div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(30rem,1fr))] gap-4'>
        {student &&
        permissions.author &&
        permissions.author.includes('NEWS') ? (
          <Card className='w-full h-full border-dashed'>
            <CardContent className='h-full pt-6'>
              <Dialog>
                <DialogTrigger
                  className='w-full h-full grid place-items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded cursor-pointer'
                  title='Upload an article'
                  aria-label='Upload an article'
                >
                  <div className=''>
                    <PlusIcon className='w-6 h-6' />
                  </div>
                </DialogTrigger>
                <NewsUpload
                  language={language}
                  author={{
                    ...student,
                    author_type: 'STUDENT',
                  }}
                />
              </Dialog>
            </CardContent>
          </Card>
        ) : null}
        {pageIndex === 1 ? (
          // SSR data
          data.items.map((newsItem) => (
            <div key={newsItem.url} className='relative'>
              {Object.keys(newsItem).length === 0 ? (
                <Skeleton className='w-full h-full' />
              ) : (
                <>
                  <ExtraNewsCard language={language} news={newsItem} />
                </>
              )}
            </div>
          ))
        ) : (
          // CSR data
          <NewsPaginationPage language={language} index={pageIndex} />
        )}
      </div>
      <div className='flex justify-center my-4'>
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

            {Array.from({ length: data.total_pages }, (_, i) => i + 1).map(
              (page) => (
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
              )
            )}

            <PaginationItem>
              <Button
                className='w-10 h-10'
                size={'icon'}
                disabled={pageIndex === data.total_pages}
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                  setPageIndex((prev) =>
                    prev + 1 > data.total_pages ? data.total_pages : prev + 1
                  )
                }}
              >
                <ChevronRightIcon className='w-6 h-6' />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
