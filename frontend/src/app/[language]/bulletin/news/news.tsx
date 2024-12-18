import { getNewsPagniation } from '@/api/items/news'
import AllNews from '@/app/[language]/bulletin/news/client/allNews'
import HeaderGap from '@/components/header/components/HeaderGap'
import News from '@/models/items/News'
import { LanguageCode } from '@/models/Language'

import type { JSX } from 'react'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

/**
 * @name NewsPage
 * @description This component is used to display the news page.
 *
 * @param {Params} params
 * @param {string} params.language - The language of the news
 *
 * @returns {JSX.Element} The news page
 */
export default async function NewsPage(props: Props): Promise<JSX.Element> {
  const { language } = await props.params
  const { data: paginatedNews, error } = await getNewsPagniation(language, 1)

  if (error) {
    return (
      <div className='h-96 grid place-items-center text-3xl'>No data...</div>
    )
  }

  paginatedNews.items = paginatedNews.items as News[]

  return (
    <main className='grid place-items-center'>
      <HeaderGap />
      <h1 className='text-4xl py-10'>News</h1>
      <AllNews language={language} data={paginatedNews} />
    </main>
  )
}
