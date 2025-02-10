import CommitteeTag from '@/components/tags/CommitteeTag'
import StudentTag from '@/components/tags/StudentTag'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type Committee from '@/models/Committee'
import type Student from '@/models/Student'
import type News from '@/models/items/News'
import Image from 'next/image'
import Link from 'next/link'

import type { JSX } from 'react'

interface Props {
  newsItem: News
}

/**
 * @name NewsCard
 * @description This component is used to display a news card that is used when displaying all news.
 *
 * @param {Props} props
 * @param {News} props.newsItem - The news item to display.
 *
 * @returns {JSX.Element} The news card component.
 */
export default function NewsCard({ newsItem }: Props): JSX.Element {
  return (
    <Card
      className='w-full h-full'
      title={newsItem.translations[0].title}
      aria-label={newsItem.translations[0].title}
    >
      <CardHeader>
        <Link href={`./news/${newsItem.url}`} className='group w-full h-fit'>
          <div className='flex items-center gap-1'>
            {newsItem.translations[0].main_image_url && (
              <Image
                src={newsItem.translations[0].main_image_url}
                alt={`${newsItem.translations[0].title} Image`}
                width={300}
                height={100}
                className='object-cover w-8 h-auto aspect-square rounded-md'
              />
            )}

            <CardTitle className='underline-offset-4 text-xl leading-tight decoration-yellow-400 decoration-2 group-hover:underline max-w-[280px] truncate'>
              {newsItem.translations[0].title}
            </CardTitle>
          </div>
          <CardDescription className='h-12 overflow-hidden group-hover:underline no-underline! py-1 text-xs'>
            {newsItem.translations[0].short_description.length > 80
              ? `${newsItem.translations[0].short_description.substring(0, 80)}...`
              : newsItem.translations[0].short_description}
          </CardDescription>
        </Link>
      </CardHeader>

      <CardFooter className='flex flex-col items-start h-fit'>
        <div className='flex flex-col justify-center'>
          {newsItem.author.author_type === 'COMMITTEE' ? (
            <CommitteeTag
              committee={newsItem.author as Committee}
              includeAt={false}
              includeBackground={false}
            >
              <span className='text-xs flex text-neutral-700 dark:text-neutral-400'>
                {new Date(newsItem.created_at).toLocaleDateString()}
              </span>
            </CommitteeTag>
          ) : (
            <StudentTag student={newsItem.author as Student} includeAt={false}>
              <span className='text-xs flex text-neutral-700 dark:text-neutral-400'>
                {new Date(newsItem.created_at).toLocaleDateString()}
              </span>
            </StudentTag>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
