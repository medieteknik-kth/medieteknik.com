'use client'

import React from 'react'
import {
  DocumentIcon,
  TagIcon,
  HandThumbUpIcon,
  CogIcon,
} from '@heroicons/react/24/outline'
import CommandBar from './commandBar'
import { AutoSaveProvdier } from './autoSave'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { API_BASE_URL } from '@/utility/Constants'
import { redirect } from 'next/navigation'
import Loading from '@/components/tooltips/Loading'
import { News } from '@/models/Items'
import useSWR from 'swr'
const ArticlePage = React.lazy(() => import('./pages/article'))
const TagsPage = React.lazy(() => import('./pages/tags'))
const EngagementPage = React.lazy(() => import('./pages/engagement'))
const SettingsPage = React.lazy(() => import('./pages/settings'))

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(
    (res) => res.json() as Promise<News>
  )

interface Props {
  language: string
  slug: string
}

interface Params {
  params: Props
}

/**
 * @name UploadNews
 * @description The component that renders the upload news page
 *
 * @param {Params} params
 * @param {Props} params.props - The parameters of the page
 * @param {string} params.props.language - The language of the article
 * @param {string} params.props.slug - The slug of the article
 * @returns {JSX.Element} The upload news page
 */
export default function UploadNews({
  params: { language, slug },
}: Params): JSX.Element {
  // TODO: Maybe a server component?
  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/news/${slug}?language=${language}`,
    fetcher
  )

  if (error) {
    redirect(`/${language}/bulletin/news`)
  }

  if (isLoading) {
    return <Loading language={language} />
  }

  if (!data) {
    redirect(`/${language}/bulletin/news`)
  }

  if (data.published_status === 'PUBLISHED') {
    redirect(`/${language}/bulletin/news`)
  }

  return (
    <main className='relative'>
      <div className='h-24' />
      <AutoSaveProvdier slug={slug} news_item={data} language_code={language}>
        <CommandBar language={language} slug={slug} />
        <div className='h-[1500px] flex relative z-10'>
          <Tabs
            orientation='vertical'
            defaultValue='article'
            className='w-full flex relative top-24 grow -z-10'
          >
            <TabsList className='w-16 h-full bg-white dark:bg-[#111] flex flex-col justify-start rounded-none z-20 border-r-2 border-yellow-400'>
              <div className='w-full sticky top-[12.5rem] flex flex-col items-center mt-2'>
                <TabsTrigger
                  value='article'
                  className='p-2 mb-2 hover:bg-neutral-400/30'
                  title='Write an article'
                >
                  <DocumentIcon className='w-8 h-8' />
                </TabsTrigger>
                <TabsTrigger
                  value='tags'
                  className='p-2 mb-2 hover:bg-neutral-400/30'
                  title='Select tags'
                  disabled // TODO: Implement tags page
                >
                  <TagIcon className='w-8 h-8' />
                </TabsTrigger>
                <TabsTrigger
                  value='engagement'
                  className='p-2 mb-2 hover:bg-neutral-400/30'
                  title='View article engagement'
                  disabled // TODO: Implement engagement page
                >
                  <HandThumbUpIcon className='w-8 h-8' />
                </TabsTrigger>
                <TabsTrigger
                  value='settings'
                  className='p-2 hover:bg-neutral-400/30'
                  title='Article settings'
                  disabled // TODO: Implement settings page
                >
                  <CogIcon className='w-8 h-8' />
                </TabsTrigger>
              </div>
            </TabsList>
            <TabsContent value='article' className='grow h-fit'>
              <React.Suspense fallback={<Loading language={language} />}>
                <ArticlePage language={language} news_data={data} />
              </React.Suspense>
            </TabsContent>
            <TabsContent value='tags' className='grow h-fit'>
              <React.Suspense fallback={<Loading language={language} />}>
                <TagsPage language={language} />
              </React.Suspense>
            </TabsContent>
            <TabsContent value='engagement' className='grow h-fit'>
              <React.Suspense fallback={<Loading language={language} />}>
                <EngagementPage />
              </React.Suspense>
            </TabsContent>
            <TabsContent value='settings' className='grow h-fit'>
              <React.Suspense fallback={<Loading language={language} />}>
                <SettingsPage />
              </React.Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </AutoSaveProvdier>
    </main>
  )
}
