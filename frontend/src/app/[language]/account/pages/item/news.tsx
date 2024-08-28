'use client'
import { NewsUpload } from '@/components/dialogs/NewsUpload'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { NewsPagination } from '@/models/Pagination'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { API_BASE_URL } from '@/utility/Constants'
import {
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  EyeIcon,
  LinkIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) =>
  fetch(url).then((res) => res.json() as Promise<NewsPagination>)

export default function AccountNewsPage({ language }: { language: string }) {
  const [copiedLink, setCopiedLink] = useState(-1)
  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/news?author=1&language=${language}`,
    fetcher
  )
  const { student } = useAuthentication()
  if (!student) return null

  if (error)
    return (
      <div className='w-full text-center text-2xl text-red-500'>
        Failed to load, try again later!
      </div>
    )
  if (isLoading) return <div>Loading...</div>

  const handleCopyLink = (index: number) => {
    if (!data) return
    navigator.clipboard.writeText(
      `${window.location.origin}/${language}/bulletin/news/${data.items[index].url}`
    )
    setCopiedLink(index)
    setTimeout(() => {
      setCopiedLink(-1)
    }, 1000)
  }

  return (
    <div className='w-full h-auto grow px-20 2xl:px-96 dark:bg-[#111]'>
      <div className='py-4 mb-4 border-b-2 border-yellow-400 flex justify-between items-center'>
        <h2 className='text-xl font-bold'>News</h2>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex items-center'>
            <p>Filters</p>
            <AdjustmentsHorizontalIcon className='w-6 h-6 ml-2' />
          </div>
          <div className='flex items-center'>
            <p>Sort By</p>
            <ChartBarIcon className='w-6 h-6 ml-2' />
          </div>
        </div>
      </div>

      <ul className='w-full max-h-[748px] overflow-auto grid grid-cols-1 grid-flow-row gap-3 *:dark:bg-[#111] pr-4'>
        <li className='w-full h-16 border-2 border-dashed border-gray-300 rounded-xl'>
          <Dialog>
            <DialogTrigger className='w-full h-full flex items-center hover:bg-neutral-300 dark:hover:bg-neutral-800 pl-4 pr-8 rounded-xl'>
              <div className='w-8 h-8 grid place-items-center border-2 border-black rounded-full mr-4'>
                <PlusIcon className='w-6 h-6' />
              </div>
              <h3 className='text-lg font-bold'>Upload</h3>
            </DialogTrigger>
            <NewsUpload language={language} author={student} />
          </Dialog>
        </li>
        {data &&
          data.items &&
          data.items.map((item, index) => (
            <li
              key={index}
              className='w-full h-fit border-2 border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 flex justify-between items-center pl-4 pr-8'
            >
              <div className='py-2 flex flex-col items-start'>
                <Link
                  href={
                    item.published_status === 'PUBLISHED'
                      ? `/${language}/bulletin/news/${item.url}`
                      : `/${language}/bulletin/news/upload/${item.url}`
                  }
                  target='_blank'
                  className='underline underline-offset-4 decoration-2 pb-1'
                >
                  <h3 className='text-lg font-bold'>
                    {item.translations[0].title}
                  </h3>
                </Link>
                <Badge
                  className={`
                    ${
                      item.published_status === 'PUBLISHED'
                        ? 'bg-emerald-600 hover:bg-emerald-400'
                        : 'bg-rose-600 hover:bg-rose-400'
                    }
                    font-bold
                    text-white
                  `}
                >
                  {item.published_status}
                </Badge>
              </div>
              <div className='grid grid-cols-4 gap-4 py-2'>
                <Button size={'icon'} variant={'outline'}>
                  <EyeIcon className='w-6 h-6' />
                </Button>
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
                        <TooltipContent className='z-10'>Copied</TooltipContent>

                        <LinkIcon className='w-5 h-5' />
                      </Button>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
                <Button size={'icon'}>
                  <PencilSquareIcon className='w-6 h-6' />
                </Button>
                <Button size={'icon'} variant={'destructive'}>
                  <TrashIcon className='w-6 h-6' />
                </Button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}
