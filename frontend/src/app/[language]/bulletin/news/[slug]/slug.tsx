import { getNewsData } from '@/api/items/news'
import NewsRedirect from '@/app/[language]/bulletin/news/[slug]/client/redirect'
import type { LanguageCode } from '@/models/Language'

import type { JSX } from 'react'

interface Params {
  language: LanguageCode
  slug: string
}

interface Props {
  params: Promise<Params>
}

/**
 * @name NewsSlug
 * @description This is the news slug page, it will render the redirect component if the news data is not available
 *
 * @param {Params} params - The dynamic URL parameters
 * @param {string} params.language - The language of the news
 * @param {string} params.slug - The slug of the news
 *
 * @returns {Promise<JSX.Element>} The news slug page
 */
export default async function NewsSlug(props: Props): Promise<JSX.Element> {
  const { language, slug } = await props.params
  const { data } = await getNewsData(language, slug)

  return (
    <main className='w-full grid place-items-center'>
      <NewsRedirect language={language} news_data={data} />
    </main>
  )
}
