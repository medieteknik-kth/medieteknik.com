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
import { useToast } from '@/components/ui/use-toast'
import { News } from '@/models/Items'
import { LinkIcon, TagIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import ShortNews from '../components/shortNews'

import type { JSX } from 'react'

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
  data,
}: {
  language: string
  data: News[]
}): JSX.Element {
  const { toast } = useToast()

  const { t } = useTranslation(language, 'bulletin')

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
              data.map((newsItem, index) => (
                <li key={index} className='relative'>
                  <ShortNews
                    key={index}
                    language={language}
                    newsItem={newsItem}
                  />
                  <div className='hidden md:block'>
                    <Button
                      variant='outline'
                      size='icon'
                      title='Share'
                      aria-label='Share'
                      className='absolute bottom-4 right-4 z-10'
                      onClick={() => {
                        navigator.clipboard.writeText(
                          window.location.href + '/news/' + newsItem.url
                        )
                        toast({
                          title: 'Copied to clipboard',
                          description:
                            window.location.href + '/news/' + newsItem.url,
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
                </li>
              ))}
          </ul>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>
    </section>
  )
}
