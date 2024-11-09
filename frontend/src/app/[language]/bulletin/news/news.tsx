import { GetNewsPagniation } from '@/api/items'
import AllNews from '@/app/[language]/bulletin/news/client/allNews'
import HeaderGap from '@/components/header/components/HeaderGap'
import News from '@/models/items/News'

import type { JSX } from 'react'

interface Params {
  language: string
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
  const data = await GetNewsPagniation(language, 1)

  if (!data) {
    return (
      <div className='h-96 grid place-items-center text-3xl'>No data...</div>
    )
  }

  data.items = data.items as News[]

  return (
    <main className='grid place-items-center'>
      <HeaderGap />
      <h1 className='text-4xl py-10'>News</h1>
      <AllNews language={language} data={data} />
    </main>
  )
}
