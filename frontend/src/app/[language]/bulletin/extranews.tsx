'use client'
import Loading from '@/components/tooltips/Loading'
import { News, NewsPagination } from '@/models/Items'
import { API_BASE_URL } from '@/utility/Constants'
import Image from 'next/image'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import useSWR from 'swr'
import ShortNews from './components/shortNews'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

const fetcher = (url: string) =>
  fetch(url).then((res) => res.json() as Promise<NewsPagination>)

const useNews = (index: number, language: string) => {
  const { data, error, isLoading } = useSWR<NewsPagination>(
    `${API_BASE_URL}/public/news?page=${index}&language=${language}`,
    fetcher
  )

  return {
    data,
    isLoading: isLoading,
    isError: error,
  }
}

function Page({ index, language }: { index: number; language: string }) {
  const { data, isError, isLoading } = useNews(index, language)

  if (isError)
    return {
      jsx: <div>Failed to load</div>,
      total_items: 0,
      total_pages: 0,
    }
  if (isLoading)
    return {
      jsx: <Loading language={language} />,
      total_items: 0,
      total_pages: 0,
    }
  if (!data)
    return {
      jsx: <div>No data</div>,
      total_items: 0,
      total_pages: 0,
    }

  return {
    jsx: (
      <div className='flex flex-wrap gap-4'>
        {' '}
        {data.items.map((item: News, index) => (
          <div key={index} className='relative'>
            <ShortNews newsItem={item} />
          </div>
        ))}
      </div>
    ),
    total_items: data.total_items,
    total_pages: data.total_pages,
  }
}

export default function ExtraNews({ language }: { language: string }) {
  const [page, setPage] = useState(1)
  const pages: {
    jsx: JSX.Element
    total_items: number
    total_pages: number
  }[] = []

  for (let i = 1; i <= page; i++) {
    pages.push(Page({ index: i, language: language }))
  }

  return (
    <section className='w-full h-fit pb-10'>
      <h2 className='uppercase text-neutral-600 dark:text-neutral-400 py-2 text-lg tracking-wide'>
        More News
      </h2>
      <InfiniteScroll
        dataLength={pages.length}
        hasMore={page < pages.length}
        loader={<Loading language={language} />}
        next={() => setPage(page + 1)}
        endMessage={
          <p
            className='text-center py-2 text-xl tracking-wider uppercase text-neutral-800 dark:text-neutral-300 
          select-none'
          >
            ---- No more news ----
          </p>
        }
      >
        {pages.map((page) => page.jsx)}
      </InfiniteScroll>
    </section>
  )
}
