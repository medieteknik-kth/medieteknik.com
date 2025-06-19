'use client'

import { useTranslation } from '@/app/i18n/client'
import { DraftBadge, PublishedBadge } from '@/components/badges/Items'
import Loading from '@/components/tooltips/Loading'
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
import { useToast } from '@/components/ui/use-toast'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import type { NewsPagination } from '@/models/Pagination'
import {
  CheckBadgeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardIcon,
  NewspaperIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { Link } from 'next-view-transitions'
import { type JSX, useState } from 'react'
import useSWR from 'swr'

interface Props {
  language: LanguageCode
  committee: Committee
}

const fetcher = (url: string) =>
  fetch(url, {
    credentials: 'include',
  }).then((res) => res.json() as Promise<NewsPagination>)

/**
 * @name NewsTable
 * @description The table for displaying a committee's news articles
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 * @param {Committee} props.committee - The committee data
 *
 * @returns {JSX.Element} The rendered component
 */
export default function NewsTable({ language, committee }: Props): JSX.Element {
  const [pageIndex, setPageIndex] = useState(1)
  const { data: news, error: swrError } = useSWR<NewsPagination>(
    `/api/committees/${committee.translations[0].title.toLowerCase()}/news?language=${language}&page=${pageIndex}`,
    fetcher
  )
  const { t } = useTranslation(language, 'committee_management/news')
  const { toast } = useToast()

  if (swrError) {
    console.error(swrError)
    return <p>{swrError.message}</p>
  }

  if (!news) {
    return <Loading language={language} />
  }

  return (
    <Card className='relative'>
      <CardHeader>
        <CardTitle>{t('news_articles')}</CardTitle>
        <CardDescription>
          <NewspaperIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
          {t('all_news')}
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
                { length: news.total_pages ? news.total_pages : 1 },
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
                  disabled={pageIndex === news.total_pages || !news.total_pages}
                  onClick={() => {
                    setPageIndex((prev) =>
                      prev + 1 > news.total_pages ? news.total_pages : prev + 1
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
              <TableHead className='w-32'>{t('table.created_at')}</TableHead>
              <TableHead className='w-32'>{t('table.last_updated')}</TableHead>
              <TableHead className='w-36'>{t('table.status')}</TableHead>
              <TableHead className='w-32'>{t('table.is_public')}</TableHead>
              <TableHead className='text-right w-48'>
                {t('table.actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.items
              ?.sort((a, b) => {
                if (a.last_updated && b.last_updated) {
                  return (
                    new Date(b.last_updated).getTime() -
                    new Date(a.last_updated).getTime()
                  )
                }
                return (
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
                )
              })
              .map((article) => (
                <TableRow
                  key={
                    article.url ??
                    article.news_id ??
                    article.translations[0].title
                  }
                >
                  <TableCell className='max-w-52'>
                    {article.url ? (
                      <Link
                        href={`/${language}/bulletin/news/${article.url}`}
                        className='text-blue-500 hover:underline'
                      >
                        {article.translations[0].title}
                      </Link>
                    ) : (
                      <Link
                        href={`/${language}/bulletin/news/upload/${article.news_id}`}
                        className='text-blue-500 hover:underline'
                      >
                        {article.translations[0].title}
                      </Link>
                    )}
                  </TableCell>
                  <TableCell className='w-32'>
                    {new Date(article.created_at).toLocaleDateString(language)}
                  </TableCell>
                  <TableCell className='w-32'>
                    {article.last_updated &&
                      new Date(article.last_updated).toLocaleDateString(
                        language
                      )}
                  </TableCell>
                  <TableCell>
                    {article.published_status === 'DRAFT' ? (
                      <DraftBadge language={language} />
                    ) : (
                      <PublishedBadge language={language} />
                    )}
                  </TableCell>
                  <TableCell>
                    {article.is_public && (
                      <CheckBadgeIcon className='w-5 h-5 text-green-600' />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-2'>
                      <Button
                        size={'icon'}
                        variant={'secondary'}
                        title='Copy URL'
                        onClick={() => {
                          let text = ''
                          if (article.url) {
                            text = `${window.location.origin}/${language}/bulletin/news/${article.url}`
                          } else if (article.news_id) {
                            text = `${window.location.origin}/${language}/bulletin/news/${article.news_id}`
                          } else {
                            return
                          }

                          navigator.clipboard.writeText(text)

                          toast({
                            title: 'Copied to clipboard',
                            description: text,
                            duration: 2500,
                          })
                        }}
                      >
                        <ClipboardIcon className='w-5 h-5' />
                      </Button>
                      <Button size={'icon'} variant={'destructive'}>
                        <TrashIcon className='w-5 h-5' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
