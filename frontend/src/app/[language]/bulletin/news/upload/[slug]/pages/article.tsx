'use client'
import { useState } from 'react'
import { createEditor, BaseEditor } from 'slate'
import { withReact, ReactEditor } from 'slate-react'
import { CustomElement } from '../util/Text'
import { News } from '@/models/Items'
import { useRouter } from 'next/navigation'
import NewsToolbar from '../components/toolbar'
import { ArticleProvider } from '@/providers/ArticleProvider'
import ArticleRenderer from '../components/articleRenderer'

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
  }
}

export default function ArticlePage({
  language,
  news_data,
}: {
  language: string
  news_data: News
}) {
  const [editor] = useState(() => withReact(createEditor()))
  const { push } = useRouter()

  if (Object.keys(news_data).length === 0) {
    push('/' + language + '/bulletin/news')
    return
  }

  return (
    <ArticleProvider language={language} editor={editor}>
      <section className='w-full h-fit flex justify-center relative'>
        <NewsToolbar language={language} />
        <ArticleRenderer language={language} news_data={news_data} />
      </section>
    </ArticleProvider>
  )
}
