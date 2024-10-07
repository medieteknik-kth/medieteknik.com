'use client'

import NewsDisplay from '@/app/[language]/bulletin/news/[slug]/news'
import Loading from '@/components/tooltips/Loading'
import { News } from '@/models/Items'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  language: string
  news_data: News | null
}

/**
 * @name NewsRedirect
 * @description This is the news redirect component, it will redirect to the news page if the news data is available
 *
 * @param {Props} props
 * @param {string} props.language - The language of the news
 * @param {News | null} props.news_data - The news data
 *
 * @returns {JSX.Element} The news redirect component
 */
export default function NewsRedirect({
  language,
  news_data,
}: Props): JSX.Element {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!news_data) {
      router.push(`/${language}/bulletin/news`)
      return
    }
    setIsLoading(false)
  }, [news_data, router])

  if (!isLoading || !news_data) {
    return <Loading language={language} />
  }

  return <NewsDisplay language={language} news_data={news_data} />
}
