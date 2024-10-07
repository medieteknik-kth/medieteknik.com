import { GetNewsData } from '@/api/items'
import NewsRedirect from '@/app/[language]/bulletin/news/[slug]/client/redirect'

interface Props {
  language: string
  slug: string
}

interface Params {
  params: Props
}

export const revalidate = 31_536_000 // 1 year

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
export default async function NewsSlug({
  params: { language, slug },
}: Params): Promise<JSX.Element> {
  const data = await GetNewsData(language, slug)

  return (
    <main>
      <NewsRedirect language={language} news_data={data} />
    </main>
  )
}
