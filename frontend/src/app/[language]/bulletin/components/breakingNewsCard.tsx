import CommitteeTag from '@/components/tags/CommitteeTag'
import StudentTag from '@/components/tags/StudentTag'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import type Student from '@/models/Student'
import type News from '@/models/items/News'
import Image from 'next/image'

interface Props {
  language: LanguageCode
  news: News
}

export default function BreakingNewsCard({ language, news }: Props) {
  return (
    <Card className='w-[300px] shrink-0'>
      <CardHeader className='font-bold leading-tight line-clamp-2'>
        {news.translations[0].title}
      </CardHeader>
      <CardContent>
        <div className='relative h-32'>
          {news.translations[0].main_image_url ? (
            <Image
              src={news.translations[0].main_image_url}
              alt={news.translations[0].title}
              fill
              className='object-cover'
            />
          ) : (
            <Image
              src='https://storage.googleapis.com/medieteknik-static/static/16x9.webp'
              alt={news.translations[0].title}
              fill
              className='object-cover'
            />
          )}
        </div>
      </CardContent>
      <CardFooter className='justify-between text-sm text-muted-foreground"'>
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
        <time className='text-sm text-muted-foreground'>
          {new Date(news.created_at).toLocaleDateString(language, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </time>{' '}
      </CardFooter>
    </Card>
  )
}
