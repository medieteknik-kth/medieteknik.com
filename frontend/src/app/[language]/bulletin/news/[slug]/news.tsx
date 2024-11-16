import ArticleAuthor from '@/app/[language]/bulletin/news/[slug]/articleAuthor'
import ArticleDate from '@/app/[language]/bulletin/news/[slug]/articleDate'
import NewsAuth from '@/app/[language]/bulletin/news/[slug]/client/auth'
import Body from '@/app/[language]/bulletin/news/[slug]/client/body'
import HeaderGap from '@/components/header/components/HeaderGap'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import News from '@/models/items/News'
import { LanguageCode } from '@/models/Language'
import Image from 'next/image'
import Link from 'next/link'

import type { JSX } from 'react'

interface Props {
  language: string
  news_data: News
}

/**
 * @name NewsDisplay
 * @description This is the news display component, it will render the news data
 *
 * @param {Props} props
 * @param {string} props.language - The language of the news
 * @param {News} props.news_data - The news data
 *
 * @returns {JSX.Element} The news display component
 */
export default function NewsDisplay({
  language,
  news_data,
}: Props): JSX.Element {
  return (
    <>
      <HeaderGap />
      <Breadcrumb className='w-full h-fit border-b px-4 py-2'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className='py-2'>
              <Link href={`/${language}/bulletin`}>Bulletin</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild className='py-2'>
              <Link href={`/${language}/bulletin/news`}>News</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className='py-2'>
            {news_data.translations[0].title}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <article
        className='md:min-w-[600px] w-full max-w-[700px] flex flex-col items-center justify-start min-h-[1080px] h-fit relative gap-2 px-4 sm:px-12 md:px-0'
        role='main'
      >
        <h1 className='w-full text-4xl mt-4'>
          {news_data.translations[0].title}
        </h1>
        <div className='w-full h-fit'>
          <ArticleAuthor
            news_data={news_data}
            language={language as LanguageCode}
          />
          <ArticleDate
            news_data={news_data}
            language={language as LanguageCode}
          />
          {news_data.categories && news_data.categories.length > 1 && (
            <ul className='flex min-h-10 h-fit py-2'>
              {news_data.categories.map((category) => (
                <li className='px-2 py-1 border rounded-2xl' key={category}>
                  {category}
                </li>
              ))}
            </ul>
          )}

          {news_data.translations[0].main_image_url && (
            <div className='my-2 max-h-80 w-full'>
              <Image
                src={news_data.translations[0].main_image_url}
                alt='News'
                width={756}
                height={520}
                quality={80}
                priority
                className='object-fill w-full h-auto md:w-auto md:h-full max-h-80 rounded-md md:max-w-[700px]'
              />
            </div>
          )}
        </div>
        <div className='w-full mb-4'>
          <Body body={news_data.translations[0].body} />
        </div>
        <NewsAuth language={language} news_data={news_data} />
      </article>
    </>
  )
}
