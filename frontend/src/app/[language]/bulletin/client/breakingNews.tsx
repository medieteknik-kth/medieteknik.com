'use client'

import { useTranslation } from '@/app/i18n/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import type { LanguageCode } from '@/models/Language'
import type News from '@/models/items/News'
import { API_BASE_URL } from '@/utility/Constants'
import { LinkIcon, TagIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import type { JSX } from 'react'
import useSWR from 'swr'
import ShortNews from '../components/shortNews'

const fetcher = (url: string) =>
  fetch(url, {
    credentials: 'include',
  }).then((res) => res.json() as Promise<News[]>)

/**
 * Renders the latest breaking news.
 * @name BreakingNews
 * @description Renders the latest breaking news
 *
 * @param {string} language - The language of the page
 * @returns {JSX.Element} The latest breaking news
 */
export default function BreakingNews({
  language,
}: {
  language: LanguageCode
}): JSX.Element {
  const { toast } = useToast()
  const { t } = useTranslation(language, 'bulletin')
  const { data, error, isLoading } = useSWR<News[]>(
    `${API_BASE_URL}/public/news/latest?language=${language}`,
    fetcher
  )

  if (isLoading) {
    return (
      <div className='grid grid-cols-3 grid-rows-1 gap-2'>
        {[1, 2, 3].map((index) => (
          <Skeleton key={index} className='w-full h-[172px]' />
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <p className='w-full h-[200px] grid place-items-center z-10 uppercase tracking-wider text-neutral-800 dark:text-neutral-300 select-none bg-neutral-100 dark:bg-neutral-800'>
        {t('no_breaking_news')}
      </p>
    )
  }

  return (
    <section
      id='breaking-news'
      className='w-full h-fit flex flex-col justify-center items-center'
    >
      <div className='h-fit flex justify-between items-center'>
        <h2 className='uppercase text-neutral-600 dark:text-neutral-400 py-2 text-lg tracking-wide '>
          {t('breaking_news')}
        </h2>
        <Button
          asChild
          variant='link'
          className='text-sky-800 dark:text-sky-400'
        >
          <Link href='./bulletin/news'>{t('all_news')}</Link>
        </Button>
      </div>
      <div className='w-full relative overflow-x-auto'>
        {data.length === 0 && (
          <p
            className='w-full h-[200px] grid place-items-center z-10 
          uppercase tracking-wider text-neutral-800 dark:text-neutral-300 
          select-none bg-neutral-100 dark:bg-neutral-800'
          >
            {t('no_breaking_news')}
          </p>
        )}
        <ScrollArea className='w-full'>
          <ul className='flex justify-start gap-2 pb-2'>
            {data.length > 0 &&
              data.map((newsItem) => (
                <li key={newsItem.url} className='relative'>
                  <ShortNews language={language} newsItem={newsItem} />
                  <div className='hidden md:block'>
                    <Button
                      variant='outline'
                      size='icon'
                      title='Share'
                      aria-label='Share'
                      className='absolute bottom-4 right-4 z-10'
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.href}/news/${newsItem.url}`
                        )
                        toast({
                          title: 'Copied to clipboard',
                          description: `${window.location.href}/news/${newsItem.url}`,
                          duration: 2500,
                        })
                      }}
                    >
                      <LinkIcon className='w-5 h-5' />
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          size='icon'
                          title='News Tags'
                          aria-label='News Tags'
                          className='absolute bottom-4 right-16 z-10 hidden'
                        >
                          <TagIcon className='w-6 h-6' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='absolute w-fit h-fit'>
                        <h3 className='text-lg font-bold pb-1'>Tags</h3>
                        <div className='flex'>
                          {newsItem.categories?.map((category, index) => (
                            <Badge key={category} className='w-fit mr-2'>
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </li>
              ))}
          </ul>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>
    </section>
  )
}
