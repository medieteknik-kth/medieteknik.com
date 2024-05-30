import React from 'react'
import {
  DocumentIcon,
  TagIcon,
  HandThumbUpIcon,
  CogIcon,
} from '@heroicons/react/24/outline'
import CommandBar from './commandBar'
import { AutoSaveProdier } from './autoSave'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { API_BASE_URL } from '@/utility/Constants'
import News from '@/models/Items'
import { redirect } from 'next/navigation'
const ArticlePage = React.lazy(() => import('./pages/article'))
const TagsPage = React.lazy(() => import('./pages/tags'))

async function getData(language_code: string, slug: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/news/${slug}?language_code=${language_code}`
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
      <AutoSaveProdier slug={slug} news_item={data}>
        <CommandBar language={language} />
        <div className='h-fit flex relative'>
          <Tabs
            orientation='vertical'
            defaultValue='article'
            className='w-full h-full flex justify-center relative'
          >
            <TabsList className='w-16 h-[1288px] bg-white fixed top-0 left-0 flex flex-col rounded-none z-10 border-r-2 border-yellow-400'>
              <TabsTrigger value='article' className='p-2 mb-2'>
                <DocumentIcon className='w-8 h-8' />
              </TabsTrigger>
              <TabsTrigger value='tags' className='p-2 mb-2'>
                <TagIcon className='w-8 h-8' />
              </TabsTrigger>
              <TabsTrigger value='engagement' className='p-2 mb-2'>
                <HandThumbUpIcon className='w-8 h-8' />
              </TabsTrigger>
              <TabsTrigger value='settings' className='p-2'>
                <CogIcon className='w-8 h-8' />
              </TabsTrigger>
            </TabsList>
            <TabsContent value='article' className='grow h-fit mt-48'>
              <React.Suspense fallback={<div>Loading...</div>}>
                <ArticlePage language={language} news_data={data} />
              </React.Suspense>
            </TabsContent>
            <TabsContent value='tags' className='grow h-fit mt-48'>
              <React.Suspense fallback={<div>Loading...</div>}>
                <TagsPage language={language} />
              </React.Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </AutoSaveProdier>
    </main>
  )
}
