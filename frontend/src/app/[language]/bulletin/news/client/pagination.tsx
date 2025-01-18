'use client'
import NewsCard from '@/app/[language]/bulletin/components/newsCard'
import type { NewsPagination } from '@/models/Pagination'
import { API_BASE_URL } from '@/utility/Constants'
import useSWR from 'swr'

import type { LanguageCode } from '@/models/Language'
import type { JSX } from 'react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Props {
  language: LanguageCode
  index: number
}

/**
 * @name NewsPaginationPage
 * @description This component is used to display the news pagination page. For client side rendering, it uses SWR to fetch the data.
 *
 * @param {Props} props
 * @param {string} props.language - The language of the news
 * @param {number} props.index - The index of the news
 *
 * @returns {JSX.Element | JSX.Element[]} The news pagination page
 */
export default function NewsPaginationPage({
  language,
  index,
}: Props): JSX.Element | JSX.Element[] {
  const { data } = useSWR<NewsPagination>(
    `${API_BASE_URL}/public/news?page=${index}&language=${language}`,
    fetcher
  )

  if (!data) {
    return (
      <div className='h-96 grid place-items-center text-3xl'>No data...</div>
    )
  }

  return data.items.map((newsItem) => (
    <div key={newsItem.url} className='relative'>
      <NewsCard key={newsItem.url} newsItem={newsItem} />
    </div>
  ))
}
