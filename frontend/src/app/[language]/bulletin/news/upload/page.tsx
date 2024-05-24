import React from 'react'
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  DocumentIcon,
  TagIcon,
  HandThumbUpIcon,
  CogIcon,
} from '@heroicons/react/24/outline'
import CommandBar from './commandBar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
const ArticlePage = React.lazy(() => import('./pages/article'))
const TagsPage = React.lazy(() => import('./pages/tags'))

export default function UploadNews({
  params: { language },
}: {
  params: { language: string }
}) {
  return (
    <main className='relative'>
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
              <ArticlePage language={language} />
            </React.Suspense>
          </TabsContent>
          <TabsContent value='tags' className='grow h-fit mt-48'>
            <React.Suspense fallback={<div>Loading...</div>}>
              <TagsPage language={language} />
            </React.Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
