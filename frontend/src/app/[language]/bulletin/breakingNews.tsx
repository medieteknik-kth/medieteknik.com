'use client'
import { Button } from '@/components/ui/button'
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
import ShortNews from './components/shortNews'
import { News } from '@/models/Items'
import { LinkIcon, TagIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import useSWR from 'swr'
import { API_BASE_URL } from '@/utility/Constants'

const fetcher = (url: string) =>
  fetch(url).then((res) => res.json() as Promise<News[]>)

export default function BreakingNews({ language }: { language: string }) {
  const [copiedLink, setCopiedLink] = useState(-1)
  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/public/news/latest?language=${language}`,
    fetcher
  )

  if (error) return <></>
  if (isLoading) return <div>Loading...</div>
  if (!data) return <></>

  const handleCopyLink = (url: string, id: number) => {
    navigator.clipboard.writeText(window.location.href + '/' + url)
    setCopiedLink(id)
    setTimeout(() => {
      setCopiedLink(-1)
    }, 1000)
  }

  return (
    <div className='w-fit h-fit flex *:mr-16 z-10'>
      {data.map((newsItem, index) => (
        <div key={index} className='relative'>
          <ShortNews key={index} newsItem={newsItem} />
          <TooltipProvider>
            <Tooltip open={copiedLink === index}>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  title='Share'
                  aria-label='Share'
                  className='absolute bottom-4 right-4 z-10'
                  onClick={() => handleCopyLink(newsItem.url, index)}
                >
                  <TooltipContent className='z-10'>Copied</TooltipContent>

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
                className='absolute bottom-4 right-16 z-10'
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
        </div>
      ))}
    </div>
  )
}
