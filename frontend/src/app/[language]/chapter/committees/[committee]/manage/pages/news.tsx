'use client'
import { Button } from '@/components/ui/button'
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowTopRightOnSquareIcon,
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  NewspaperIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Checkbox } from '@/components/ui/checkbox'
import { DraftBadge, PublishedBadge } from '@/components/badges/Items'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function NewsPage({
  language,
  data,
}: {
  language: string
  data: {
    news: {
      ids: string[]
      total: number
    }
  } | null
}) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (data) {
      setIsLoading(false)
    }
  }, [data])
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
                <p className='text-2xl'>{data?.news.total}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button>
                <PlusIcon className='w-5 h-5 mr-2' />
                Add
              </Button>
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
                    <PaginationPrevious href='#' />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href='#' isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href='#'>2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href='#'>3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href='#'>4</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href='#'>5</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href='#' />
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
                <TableRow>
                  <TableCell className='max-w-52 truncate'>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Recusandae excepturi a fugit iusto praesentium ullam illo
                    magnam, nesciunt sit. Iste laudantium exercitationem
                    deleniti culpa fugiat quo nesciunt ratione quod repellat.
                  </TableCell>
                  <TableCell>
                    <DraftBadge language={language} />
                  </TableCell>
                  <TableCell className='w-12'>
                    <Checkbox disabled />
                  </TableCell>
                  <TableCell className='text-right w-48'>
                    <Button size={'icon'} variant={'outline'} className='mr-2'>
                      <Cog6ToothIcon className='w-5 h-5' />
                    </Button>
                    <Button size={'icon'} variant={'outline'} className='mr-2'>
                      <ArrowTopRightOnSquareIcon className='w-5 h-5' />
                    </Button>
                    <Button
                      size={'icon'}
                      variant={'destructive'}
                      className='mr-2'
                    >
                      <TrashIcon className='w-5 h-5' />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='max-w-52 truncate'>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Recusandae excepturi a fugit iusto praesentium ullam illo
                    magnam, nesciunt sit. Iste laudantium exercitationem
                    deleniti culpa fugiat quo nesciunt ratione quod repellat.
                  </TableCell>
                  <TableCell>
                    <PublishedBadge language={language} />
                  </TableCell>
                  <TableCell className='w-12'>
                    <Checkbox defaultChecked disabled />
                  </TableCell>
                  <TableCell className='text-right w-48'>
                    <Button size={'icon'} variant={'outline'} className='mr-2'>
                      <Cog6ToothIcon className='w-5 h-5' />
                    </Button>
                    <Button size={'icon'} variant={'outline'} className='mr-2'>
                      <ArrowTopRightOnSquareIcon className='w-5 h-5' />
                    </Button>
                    <Button
                      size={'icon'}
                      variant={'destructive'}
                      className='mr-2'
                    >
                      <TrashIcon className='w-5 h-5' />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
