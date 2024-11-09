import NewsAuth from '@/app/[language]/bulletin/news/[slug]/client/auth'
import Body from '@/app/[language]/bulletin/news/[slug]/client/body'
import { assignCorrectAuthor } from '@/app/[language]/bulletin/news/[slug]/util'
import HeaderGap from '@/components/header/components/HeaderGap'
import CommitteePositionTag from '@/components/tags/CommitteePositionTag'
import CommitteeTag from '@/components/tags/CommitteeTag'
import StudentTag from '@/components/tags/StudentTag'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Committee, { CommitteePosition } from '@/models/Committee'
import News from '@/models/items/News'
import Student from '@/models/Student'
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
  const correctedAuthor = assignCorrectAuthor(news_data.author)
  if (!correctedAuthor) {
    return <div>Not found author</div>
  }

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
      <div className='flex flex-col items-center justify-start min-h-[1080px] h-fit px-4 sm:px-20 xl:px-96 relative'>
        <div className='md:min-w-[600px] w-full max-w-[700px] h-fit border-b-2 border-yellow-400 pb-1 mb-1'>
          <ul className='flex min-h-10 h-fit py-2'>
            {news_data.categories &&
              news_data.categories.map((category) => (
                <li className='px-2 py-1 border rounded-2xl' key={category}>
                  {category}
                </li>
              ))}
          </ul>
          <h1 className='text-4xl'>{news_data.translations[0].title}</h1>
          <p className='text-sm text-muted-foreground'>
            {news_data.translations[0].short_description}
          </p>
          {news_data.translations[0].main_image_url && (
            <div className='my-2 max-h-80'>
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
          <h2 className='text-lg my-2'>
            {correctedAuthor && correctedAuthor.author_type === 'STUDENT' ? (
              <StudentTag
                student={correctedAuthor as Student}
                includeAt={false}
              />
            ) : correctedAuthor.author_type === 'COMMITTEE' ? (
              <CommitteeTag
                committee={correctedAuthor as Committee}
                includeAt={false}
                includeBackground={false}
              />
            ) : (
              correctedAuthor.author_type === 'COMMITTEE_POSITION' && (
                <CommitteePositionTag
                  committeePosition={correctedAuthor as CommitteePosition}
                />
              )
            )}
          </h2>
          <p className='text-sm mt-4'>
            <span className='font-bold'>Published: </span>
            {new Date(news_data.created_at).toDateString()}
          </p>
          {news_data.last_updated &&
            new Date(news_data.last_updated).getTime() ===
              new Date(news_data.created_at).getTime() && (
              <p className='text-sm mt-2'>
                <span className='font-bold'>Last updated: </span>
                {new Date(news_data.last_updated).toDateString()}
              </p>
            )}
        </div>
        <div className='md:min-w-[600px] w-full max-w-[700px] my-4 mb-8'>
          <Body body={news_data.translations[0].body} />
        </div>
        <NewsAuth language={language} news_data={news_data} />
      </div>
    </>
  )
}
