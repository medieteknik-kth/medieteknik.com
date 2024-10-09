'use client'

import { News } from '@/models/Items'
import { ArticleProvider } from '@/providers/ArticleProvider'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BaseEditor, createEditor } from 'slate'
import { ReactEditor, withReact } from 'slate-react'
import ArticleRenderer from '../components/articleRenderer'
import NewsToolbar from '../components/toolbar'
import { CustomElement } from '../util/Text'

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
  }
}

interface Props {
  language: string
  news_data: News
}

/**
 * @name ArticlePage
 * @description The component that renders the editable section of the article
 *
 * @param {Props} props
 * @param {string} props.language - The language of the article
 * @param {News} props.news_data - The news data
 *
 * @returns {JSX.Element} The editable section of the article
 * @see {ArticleProvider} for the provider of the article editor
 */
export default function ArticlePage({
  language,
  news_data,
}: Props): JSX.Element {
  const withLinks = (editor: BaseEditor & ReactEditor) => {
    const { isInline, isVoid } = editor

    editor.isInline = (element) => {
      return 'type' in element &&
        (element.type === 'external link' || element.type === 'internal link')
        ? true
        : isInline(element)
    }

    editor.isVoid = (element) => {
      return 'type' in element &&
        (element.type === 'external link' || element.type === 'internal link')
        ? false
        : isVoid(element)
    }

    return editor
  }

  const [editor] = useState(() => withLinks(withReact(createEditor())))
  const { push } = useRouter()

  if (Object.keys(news_data).length === 0) {
    push('/' + language + '/bulletin/news')
    return <></>
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
