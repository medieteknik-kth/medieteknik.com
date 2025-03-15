import { getCommitteeMembers } from '@/api/committee'
import { getNewsData } from '@/api/items/news'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import type { StudentCommitteePositionPagination } from '@/models/Pagination'
import dynamic from 'next/dynamic'
const NewsRedirect = dynamic(
  () => import('@/app/[language]/bulletin/news/[slug]/client/redirect')
)

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
  const { data: newsData } = await getNewsData(language, slug)
  let snapshotMembers: StudentCommitteePositionPagination | null = null

  if (newsData?.author?.author_type === 'COMMITTEE') {
    const formattedDate = new Date(newsData.created_at)
      .toISOString()
      .split('T')[0]
    const { data: members } = await getCommitteeMembers(
      (newsData.author as Committee).translations[0].title,
      language,
      formattedDate,
      true
    )
    snapshotMembers = members
  }

  return (
    <main className='w-full'>
      <NewsRedirect
        language={language}
        news={newsData}
        members={snapshotMembers}
      />
    </main>
  )
}
