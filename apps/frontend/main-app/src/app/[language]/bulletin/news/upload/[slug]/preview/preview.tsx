'use client'

import NewsDisplay from '@/app/[language]/bulletin/news/[slug]/news'
import Loading from '@/components/tooltips/Loading'
import { Button } from '@/components/ui/button'
import type { LanguageCode } from '@/models/Language'
import type { StudentCommitteePositionPagination } from '@/models/Pagination'
import type News from '@/models/items/News'
import { Link } from 'next-view-transitions'
import { useSearchParams } from 'next/navigation'
import { use } from 'react'
import useSWR from 'swr'

interface Params {
  language: LanguageCode
  slug: string
}

interface Props {
  params: Promise<Params>
}

const fetcher = (url: string) =>
  fetch(url, {
    credentials: 'include',
  }).then((res) => res.json())

export default function PreviewPage(props: Props) {
  const { language, slug } = use(props.params)
  const formattedDate = new Date().toISOString().split('T')[0]
  const { data: newsData, error: newsError } = useSWR<News>(
    `/api/news/${slug}?language=${language}`,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
    }
  )
  const searchParams = useSearchParams()

  const { data: members, error: membersError } =
    useSWR<StudentCommitteePositionPagination>(
      `/api/public/committees/${searchParams.get('committee')}/members?language=${language}&page=${1}&per_page=${25}&snapshot_date=${formattedDate}&officials=true`,
      fetcher,
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshWhenHidden: false,
      }
    )

  let snapshotMembers: StudentCommitteePositionPagination | null = null

  if (members) {
    snapshotMembers = members
  }

  if (newsError || membersError) {
    return (
      <div>
        <h1>Error</h1>
        <p>{newsError?.message}</p>
        <p>{membersError?.message}</p>
      </div>
    )
  }

  if (!newsData || !members) {
    return <Loading language={language} />
  }

  return (
    <main className='relative'>
      <NewsDisplay
        language={language}
        news={newsData}
        members={snapshotMembers}
        previewMode
      />
      <div className='fixed bottom-8 left-0 right-0 mx-auto w-fit space-y-2 z-40'>
        <div className='mx-auto p-4 w-96 rounded-lg flex items-center justify-center border bg-destructive text-white font-bold animate-pulse select-none duration-[5s] motion-reduce:animate-none'>
          <p>Preview Mode</p>
        </div>
        <Button variant={'outline'} asChild>
          <Link
            href={`/${language}/bulletin/news/upload/${slug}`}
            className='w-full'
          >
            Return to editor
          </Link>
        </Button>
      </div>
    </main>
  )
}
