'use client'

import type {
  CustomElement,
  CustomText,
} from '@/app/[language]/bulletin/news/upload/[slug]/util/Text'
import type { LanguageCode } from '@/models/Language'
import type News from '@/models/items/News'
import { ArticleProvider } from '@/providers/ArticleProvider'
import { useRouter } from 'next/navigation'
import { type JSX, useState } from 'react'
import { type BaseEditor, createEditor } from 'slate'
import { type ReactEditor, withReact } from 'slate-react'
import ArticleRenderer from '../components/articleRenderer'
import NewsToolbar from '../components/toolbar'

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

interface Props {
  language: LanguageCode
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
    push(`/${language}/bulletin/news`)
    return <></>
  }

  return (
    <ArticleProvider language={language} editor={editor}>
      <section className='w-full h-fit flex justify-center relative'>
        <NewsToolbar language={language} />
        <ArticleRenderer news_data={news_data} />
      </section>
    </ArticleProvider>
  )
}
