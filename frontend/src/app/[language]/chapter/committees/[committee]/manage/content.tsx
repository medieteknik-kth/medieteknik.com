'use client'

import Loading from '@/components/tooltips/Loading'
import { TabsContent } from '@/components/ui/tabs'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { CommitteeManagementProvider } from '@/providers/CommitteeManagementProvider'
import { type JSX, Suspense, lazy } from 'react'
const HomePage = lazy(() => import('./pages/home/home'))
const MembersPage = lazy(() => import('./pages/members'))
const NewsPage = lazy(() => import('./pages/news/news'))
const EventPage = lazy(() => import('./pages/events/events'))
const DocumentPage = lazy(() => import('./pages/documents/documents'))

interface Props {
  language: LanguageCode
  committee: Committee
}

/**
 * @name Content
 * @description The content for the committee management page, with tabs for different sections
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 * @param {Committee} props.committee - The committee data
 *
 * @returns {JSX.Element} The rendered component
 * @see {@link CommitteeManagementProvider}
 */
export default function Content({ language, committee }: Props): JSX.Element {
  return (
    <CommitteeManagementProvider committee={committee} language={language}>
      <TabsContent value='home'>
        <Suspense fallback={<Loading language={language} />}>
          <HomePage language={language} committee={committee} />
        </Suspense>
      </TabsContent>
      <TabsContent value='members'>
        <Suspense fallback={<Loading language={language} />}>
          <MembersPage committee={committee} language={language} />
        </Suspense>
      </TabsContent>
      <TabsContent value='news'>
        <Suspense fallback={<Loading language={language} />}>
          <NewsPage language={language} committee={committee} />
        </Suspense>
      </TabsContent>
      <TabsContent value='events'>
        <Suspense fallback={<Loading language={language} />}>
          <EventPage language={language} />
        </Suspense>
      </TabsContent>
      <TabsContent value='documents'>
        <Suspense fallback={<Loading language={language} />}>
          <DocumentPage language={language} committee={committee} />
        </Suspense>
      </TabsContent>
    </CommitteeManagementProvider>
  )
}
