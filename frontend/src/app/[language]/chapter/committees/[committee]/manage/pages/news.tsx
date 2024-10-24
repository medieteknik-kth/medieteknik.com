'use client'
import { DraftBadge, PublishedBadge } from '@/components/badges/Items'
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import Committee from '@/models/Committee'
import { NewsPagination } from '@/models/Pagination'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import { API_BASE_URL } from '@/utility/Constants'
import {
  BookOpenIcon,
  CheckBadgeIcon,
  ClipboardIcon,
  NewspaperIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useState, type JSX } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) =>
  fetch(url, {
    credentials: 'include',
  }).then((res) => res.json() as Promise<NewsPagination>)

/**
 * @name NewsPage
 * @description The page for managing a committees news articles
 *
 * @param {string} language - The language of the page
 * @param {Committee} committee - The committee to manage
 * @returns {JSX.Element} The rendered component
 */
export default function NewsPage({
  language,
  committee,
}: {
  language: string
  committee: Committee
}): JSX.Element {
  const [pageIndex, setPageIndex] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { data: news, error: swrError } = useSWR<NewsPagination>(
    `${API_BASE_URL}/committees/${committee.translations[0].title.toLowerCase()}/news?language=${language}&page=${pageIndex}`,
    fetcher
  )
  const { total_news, isLoading: isLoadingNews } = useCommitteeManagement()
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    if (!isLoadingNews) {
      setIsLoading(false)
    }
  }, [isLoadingNews])

  if (swrError) {
    console.error(swrError)
    return <p>{swrError.message}</p>
  }

  if (!news) {
    return <p>Loading...</p>
  }

  return (
    <section className='grow'>
      <h2 className='text-2xl py-3 border-b-2 border-yellow-400'>News</h2>
      <div className='flex flex-col mt-4'>
        <div className='flex mb-4'>
          <Card className='w-72 relative'>
            <CardHeader>
              <CardTitle>Total Articles</CardTitle>
              <CardDescription>
                <BookOpenIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Amount of Articles Created
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
                  <Button>Create a News Article</Button>
                </DialogTrigger>
                <NewsUpload language={language} author={committee} />
              </Dialog>
            </CardFooter>
          </Card>
        </div>
        <Card className='relative'>
          <CardHeader>
            <CardTitle>News Articles</CardTitle>
            <CardDescription>
              <NewspaperIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
              All Articles (20 per page)
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
                  {Array.from({ length: news.total_pages }, (_, i) => (
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
                          if (prev < news.total_pages - 1) {
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
                  <TableHead className='w-36'>Publishing Status</TableHead>
                  <TableHead className='w-12'>Public</TableHead>
                  <TableHead className='text-right w-48'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.items.map((article, index) => (
                  <TableRow key={index}>
                    <TableCell className='max-w-52'>
                      {article.translations[0].title}
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
                            navigator.clipboard.writeText(
                              window.location.origin +
                                '/' +
                                language +
                                '/bulletin/news/' +
                                article.url
                            )
                            toast({
                              title: 'Copied to clipboard',
                              description:
                                window.location.origin +
                                '/' +
                                language +
                                '/bulletin/news/' +
                                article.url,
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
      </div>
    </section>
  )
}
