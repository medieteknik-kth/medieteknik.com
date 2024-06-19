import React from 'react'
import {
  DocumentIcon,
  TagIcon,
  HandThumbUpIcon,
  CogIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline'
import CommandBar from './commandBar'
import { AutoSaveProvdier } from './autoSave'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { API_BASE_URL } from '@/utility/Constants'
import { redirect } from 'next/navigation'
const ArticlePage = React.lazy(() => import('./pages/article'))
const TagsPage = React.lazy(() => import('./pages/tags'))
const EngagementPage = React.lazy(() => import('./pages/engagement'))
const SettingsPage = React.lazy(() => import('./pages/settings'))

async function getData(language_code: string, slug: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/news/${slug}?language_code=${language_code}`,
      {
        cache: 'no-store',
      }
    )

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      console.error('Error fetching data:', response.statusText)
      return null
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

export default async function UploadNews({
  params: { language, slug },
}: {
  params: { language: string; slug: string }
}) {
  const data = await getData(language, slug)

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
        <CommandBar language={language} />
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
                >
                  <TagIcon className='w-8 h-8' />
                </TabsTrigger>
                <TabsTrigger
                  value='engagement'
                  className='p-2 mb-2 hover:bg-neutral-400/30'
                  title='View article engagement'
                >
                  <HandThumbUpIcon className='w-8 h-8' />
                </TabsTrigger>
                <TabsTrigger
                  value='settings'
                  className='p-2 hover:bg-neutral-400/30'
                  title='Article settings'
                >
                  <CogIcon className='w-8 h-8' />
                </TabsTrigger>
              </div>
            </TabsList>
            <TabsContent value='article' className='grow h-fit'>
              <React.Suspense fallback={<div>Loading...</div>}>
                <ArticlePage language={language} news_data={data} />
              </React.Suspense>
            </TabsContent>
            <TabsContent value='tags' className='grow h-fit'>
              <React.Suspense fallback={<div>Loading...</div>}>
                <TagsPage language={language} />
              </React.Suspense>
            </TabsContent>
            <TabsContent value='engagement' className='grow h-fit'>
              <React.Suspense fallback={<div>Loading...</div>}>
                <EngagementPage />
              </React.Suspense>
            </TabsContent>
            <TabsContent value='settings' className='grow h-fit'>
              <React.Suspense fallback={<div>Loading...</div>}>
                <SettingsPage />
              </React.Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </AutoSaveProvdier>
    </main>
  )
}
