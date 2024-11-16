import CommitteePositionTag from '@/components/tags/CommitteePositionTag'
import CommitteeTag from '@/components/tags/CommitteeTag'
import StudentTag from '@/components/tags/StudentTag'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Committee, { CommitteePosition } from '@/models/Committee'
import News from '@/models/items/News'
import Student from '@/models/Student'
import Image from 'next/image'
import Link from 'next/link'
import FallbackImage from 'public/images/logo.webp'
import type { JSX } from 'react'

interface Props {
  language: string
  newsItem: News
}

/**
 * @name ShortNews
 * @description This component is used to display a short news card that is used when displaying breaking news on the bulletin page.
 *
 * @param {Props} props
 * @param {string} props.language - The language of the news
 * @param {News} props.newsItem - The news item to display
 *
 * @returns {JSX.Element} The short news card component
 */
export default function ShortNews({ language, newsItem }: Props): JSX.Element {
  return (
    <Card className='w-[300px] md:w-[492px] h-[100px] md:h-[164px] grid grid-cols-3 gap-2'>
      <Link
        href={`./bulletin/news/${newsItem.url}`}
        className='group w-auto h-full aspect-square p-2 relative overflow-hidden'
        title={newsItem.translations[0].title}
        aria-label={newsItem.translations[0].title}
      >
        <Image
          src={newsItem.translations[0].main_image_url || FallbackImage.src}
          alt={newsItem.translations[0].title}
          width={175}
          height={175}
          priority
          loading='eager'
          className={`h-full w-full rounded-md object-cover ${
            newsItem.translations[0].main_image_url ? '' : 'p-4'
          }`}
        />
      </Link>

      <div className='h-full flex-grow flex flex-col max-w-max justify-center md:justify-between col-span-2'>
        <CardHeader className='w-fit h-fit p-2 pl-0'>
          <Link
            href={`./bulletin/news/${newsItem.url}`}
            className='group max-w-[190px] md:max-w-[320px] max-h-24 overflow-hidden'
          >
            <CardTitle className='w-full text-base md:text-xl underline-offset-4 decoration-yellow-400 decoration-2 group-hover:underline truncate'>
              {newsItem.translations[0].title}
            </CardTitle>
            <CardDescription className='w-full group-hover:underline !no-underline'>
              {newsItem.translations[0].short_description}
            </CardDescription>
          </Link>
        </CardHeader>

        <CardFooter className='w-full hidden md:flex justify-between items-center max-w-[325px] p-0 mb-2'>
          {newsItem.author.author_type === 'STUDENT' ? (
            <StudentTag student={newsItem.author as Student} includeAt={false}>
              <span className='text-xs text-neutral-700 dark:text-neutral-300'>
                {new Date(newsItem.created_at).toLocaleDateString(language, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </StudentTag>
          ) : newsItem.author.author_type === 'COMMITTEE' ? (
            <CommitteeTag
              committee={newsItem.author as Committee}
              includeAt={false}
              includeBackground={false}
            >
              <span className='text-xs text-neutral-700 dark:text-neutral-300'>
                {new Date(newsItem.created_at).toLocaleDateString(language, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </CommitteeTag>
          ) : (
            <CommitteePositionTag
              committeePosition={newsItem.author as CommitteePosition}
            />
          )}
        </CardFooter>
      </div>
    </Card>
  )
}
