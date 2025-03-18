import CommitteeTag from '@/components/tags/CommitteeTag'
import StudentTag from '@/components/tags/StudentTag'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import type Student from '@/models/Student'
import type News from '@/models/items/News'
import { Link } from 'next-view-transitions'
import Image from 'next/image'

interface Props {
  language: LanguageCode
  news: News
}

export function LoadingNewsCard() {
  return (
    <Card className='h-full flex flex-col'>
      <CardHeader className='flex-none space-y-4'>
        <div className='space-y-2'>
          <Skeleton className='h-6 w-1/2' />
          <Skeleton className='h-4 w-1/3' />
        </div>
      </CardHeader>
      <CardContent className='flex-none'>
        <div className='relative aspect-video overflow-hidden rounded-md'>
          <Skeleton className='h-full w-full' />
        </div>
      </CardContent>
      <CardFooter className='flex-none justify-between items-center'>
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-8 w-8 rounded-full' />
          <Skeleton className='h-4 w-1/4' />
        </div>
        <Skeleton className='h-4 w-1/4' />
      </CardFooter>
    </Card>
  )
}

export default function ExtraNewsCard({ language, news }: Props) {
  return (
    <Card className='h-full flex flex-col group/news'>
      <CardHeader className='flex-none space-y-4 group-hover/news:underline'>
        <Link
          href={`/${language}/bulletin/news/${news.url}` || ''}
          className='space-y-2'
        >
          <h3
            className='text-2xl font-bold leading-tight'
            title={news.translations[0].title}
          >
            {news.translations[0].title}
          </h3>
          <p
            className='text-muted-foreground'
            title={news.translations[0].short_description}
          >
            {news.translations[0].short_description}
          </p>
        </Link>
      </CardHeader>
      <CardContent
        className='flex-none group-hover/news:underline'
        title={news.translations[0].title}
      >
        <Link href={`/${language}/bulletin/news/${news.url}` || ''}>
          {news.translations[0].main_image_url ? (
            <div className='relative aspect-video overflow-hidden rounded-md'>
              <Image
                src={news.translations[0].main_image_url}
                alt={news.translations[0].title}
                fill
                className='object-cover'
              />
            </div>
          ) : (
            <div className='relative aspect-video overflow-hidden rounded-md'>
              <Image
                src='https://storage.googleapis.com/medieteknik-static/static/16x9.webp'
                alt='Stock image'
                fill
                className='object-cover'
              />
            </div>
          )}
        </Link>
      </CardContent>
      <CardFooter className='flex-none mt-auto justify-between items-center no-underline relative'>
        <div className='flex items-center space-x-4'>
          {news.author.author_type === 'STUDENT' ? (
            <StudentTag
              student={news.author as Student}
              language={language}
              includeImage
            />
          ) : (
            <CommitteeTag
              committee={news.author as Committee}
              language={language}
              includeImage
            />
          )}
        </div>
        <time className='text-sm text-muted-foreground ml-auto'>
          {new Date(news.created_at).toLocaleDateString(language, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </time>
      </CardFooter>
    </Card>
  )
}
