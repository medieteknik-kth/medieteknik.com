'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  TagIcon,
  InformationCircleIcon,
  LinkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import NewsCard from '../components/newsCard'
import { NewsPagination } from '@/models/Items'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useCallback, useState } from 'react'
import { UploadNews } from '@/components/dialogs/Upload'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

const maxPages = 10

function PageScroll({
  toBack,
  toNext,
  currentPage,
}: {
  toBack: () => void
  toNext: () => void
  currentPage: number
}) {
  return (
    <div className='w-fit place-self-end flex items-center justify-around'>
      <Button
        size='icon'
        className='mr-4'
        onClick={toBack}
        disabled={currentPage === 1}
        title='Previous Page'
        aria-label='Previous Page'
      >
        <ChevronLeftIcon className='w-6 h-6' />
      </Button>
      <p className='w-14 text-center'>
        {currentPage} <span className='text-neutral-500'>/ {maxPages}</span>{' '}
      </p>
      <Button
        size='icon'
        className='ml-4'
        onClick={toNext}
        disabled={currentPage === maxPages}
        title='Next Page'
        aria-label='Next Page'
      >
        <ChevronRightIcon className='w-6 h-6' />
      </Button>
    </div>
  )
}

export default function AllNews({
  language,
  data,
}: {
  language: string
  data: NewsPagination
}) {
  type SortTypes = 'date' | 'author'
  const [copiedLink, setCopiedLink] = useState(-1)
  const [currentPage, setCurrentPage] = useState(data.page)

  const toBack = useCallback(() => {
    setCurrentPage((prev) => {
      if (prev === 1) return prev
      return prev - 1
    })
  }, [setCurrentPage])

  const toNext = useCallback(() => {
    setCurrentPage((prev) => prev + 1)
  }, [setCurrentPage])

  const handleCopyLink = (index: number) => {
    navigator.clipboard.writeText(
      window.location.href + '/' + data.items[index].url
    )
    setCopiedLink(index)
    setTimeout(() => {
      setCopiedLink(-1)
    }, 1000)
  }

  return (
    <Card className='w-fit desktop:w-[1784px] mb-24'>
      <CardHeader className='h-24'>
        <div className='grid grid-cols-4 gap-20'>
          <div className='flex relative'>
            <Input type='text' name='searchbar' placeholder='Search' />
            <Button
              type='submit'
              size='icon'
              className='absolute right-10'
              title='Search'
              aria-label='Search'
            >
              <MagnifyingGlassIcon className='w-6 h-6' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              className=''
              title='Information'
              aria-label='Information'
            >
              <InformationCircleIcon className='w-6 h-6' />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='flex justify-between'>
                <div className='flex items-center'>
                  <AdjustmentsHorizontalIcon className='w-6 h-6 mr-2' />
                  Filters
                </div>
                <p>
                  2 Active <span className='text-neutral-500'>/ 5 Total</span>
                </p>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-80'>
              <DropdownMenuLabel>Category</DropdownMenuLabel>
              <DropdownMenuItem>Admin</DropdownMenuItem>
              <DropdownMenuItem>Events</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Committee</DropdownMenuItem>
              <DropdownMenuItem>Student</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='flex justify-between'>
                <div className='flex items-center'>
                  <ChartBarIcon className='w-6 h-6 mr-2' />
                  Sort By
                </div>
                <div className='flex items-center'>
                  <p className='capitalize'>Date</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-80'>
              <DropdownMenuLabel>Ascending</DropdownMenuLabel>
              <DropdownMenuItem>
                <Button variant='ghost' className='w-full flex justify-start'>
                  Date
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button variant='ghost' className='w-full flex justify-start'>
                  Author
                </Button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Descending</DropdownMenuLabel>
              <DropdownMenuItem>
                <Button variant='ghost'>Date</Button>
              </DropdownMenuItem>
              <DropdownMenuItem>Author</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <PageScroll
            currentPage={currentPage}
            toBack={toBack}
            toNext={toNext}
          />
        </div>
      </CardHeader>
      <CardContent className='grid grid-flow-row grid-cols-3 desktop:grid-cols-5 *:h-96 gap-10'>
        <Card className='w-[320px] border-dashed'>
          <CardContent className='h-full pt-6'>
            <Dialog>
              <DialogTrigger
                className='w-full h-full grid place-items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded'
                title='Upload an article'
                aria-label='Upload an article'
              >
                <div className=''>
                  <PlusIcon className='w-6 h-6' />
                </div>
              </DialogTrigger>
              <DialogContent>
                <UploadNews language={language} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        {data.items.map((newsItem, index) => (
          <div key={index} className='relative'>
            {Object.keys(newsItem).length === 0 ? (
              <Skeleton className='w-full h-full' />
            ) : (
              <div>
                <NewsCard key={newsItem.url} newsItem={newsItem} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      title='Actions'
                      aria-label='Actions'
                      className='absolute bottom-8 right-4 z-10'
                    >
                      <PlusIcon className='w-5 h-5' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='flex items-center'>
                    <TooltipProvider>
                      <Tooltip open={copiedLink === index}>
                        <TooltipTrigger asChild>
                          <Button
                            variant='outline'
                            size='icon'
                            title='Share'
                            aria-label='Share'
                            className='z-10'
                            onClick={() => handleCopyLink(index)}
                          >
                            <TooltipContent className='z-10'>
                              Copied
                            </TooltipContent>

                            <LinkIcon className='w-5 h-5' />
                          </Button>
                        </TooltipTrigger>
                      </Tooltip>
                    </TooltipProvider>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          size='icon'
                          title='News Tags'
                          aria-label='News Tags'
                          className='z-10 ml-4'
                        >
                          <TagIcon className='w-6 h-6' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='absolute w-fit h-fit'>
                        <h3 className='text-lg font-bold pb-1'>Tags</h3>
                        <div className='flex'>
                          {newsItem.categories &&
                            newsItem.categories.map((category, index) => (
                              <Badge key={index} className='w-fit mr-2'>
                                {category}
                              </Badge>
                            ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter className='flex justify-center'>
        <div className='w-fit place-self-end flex items-center justify-around'>
          <PageScroll
            currentPage={currentPage}
            toBack={toBack}
            toNext={toNext}
          />
        </div>
      </CardFooter>
    </Card>
  )
}
