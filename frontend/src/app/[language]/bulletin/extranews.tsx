'use client'
import Loading from '@/components/tooltips/Loading'
import { News, NewsPagination } from '@/models/Items'
import { API_BASE_URL } from '@/utility/Constants'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import useSWR from 'swr'
import ShortNews from './components/shortNews'

/**
 * The fetcher function that fetches news data from the API.
 * @param {string} url - The URL of the API endpoint.
 * @returns {Promise<NewsPagination>} A promise that resolves to the fetched news data.
 */
const fetcher = (url: string): Promise<NewsPagination> =>
  fetch(url).then((res) => res.json() as Promise<NewsPagination>)

/**
 * Returns an object containing the data, loading status, and error status of a news page
 * fetched from the API using the specified index and language.
 *
 * @param {number} index - The index of the news page to fetch.
 * @param {string} language - The language code of the news page to fetch.
 * @return {Object} An object containing the following properties:
 *   - {NewsPagination | undefined} data - The fetched news page data.
 *   - {boolean} isLoading - A boolean indicating whether the data is currently being loaded.
 *   - {boolean} isError - A boolean indicating whether an error occurred while fetching the data.
 */
const useNews = (
  index: number,
  language: string
): {
  data: NewsPagination | undefined
  isLoading: boolean
  isError: boolean
} => {
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

/**
 * A component that renders a news page with the specified index and language.
 *
 * @param {number} index - The index of the news page to render.
 * @param {string} language - The language code of the news page to render.
 * @returns {Object} An object containing the following properties:
 *   - {JSX.Element} jsx - The JSX representation of the news page.
 *   - {number} total_items - The total number of items in the news page.
 *   - {number} total_pages - The total number of pages in the news page.
 */
function Page({ index, language }: { index: number; language: string }): {
  jsx: JSX.Element
  total_items: number
  total_pages: number
} {
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
      <>
        {data.items.map((item: News, index) => (
          <div key={index} className='relative'>
            <ShortNews newsItem={item} />
          </div>
        ))}
      </>
    ),
    total_items: data.total_items,
    total_pages: data.total_pages,
  }
}

/**
 * Extra News component that renders a list of news pages with the specified language.
 * @name ExtraNews
 *
 * @param {string} language - The language code of the news pages to render.
 * @returns {JSX.Element} The JSX representation of the Extra News component.
 */
export default function ExtraNews({
  language,
}: {
  language: string
}): JSX.Element {
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
        {pages.map((page, index) => (
          <div key={index} className='flex flex-wrap gap-4'>
            {page.jsx}
          </div>
        ))}
      </InfiniteScroll>
    </section>
  )
}
