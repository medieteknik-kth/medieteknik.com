import { News } from '@/models/Items'
import Committee from '@models/Committee'
import Student from '@models/Student'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import Link from 'next/link'
import Image from 'next/image'
import { StudentTooltip, CommitteeTooltip } from '@/components/tooltips/Tooltip'

export default function ShortNews({ newsItem }: { newsItem: News }) {
  return (
    <Card className='w-[600px] h-[200px] flex'>
      <Link
        href={`./bulletin/news/${newsItem.url}`}
        className='w-fit max-w-44 h-full p-5 pr-0 relative overflow-hidden'
        title={newsItem.translations[0].title}
        aria-label={newsItem.translations[0].title}
      >
        <Image
          src={newsItem.translations[0].main_image_url || ''}
          alt={newsItem.translations[0].title}
          width={200}
          height={200}
          className='h-full w-auto rounded-xl object-cover'
        />
      </Link>

      <div className='grow flex flex-col justify-between'>
        <CardHeader className='w-fit h-fit p-0'>
          <Link
            href={`./bulletin/news/${newsItem.url}`}
            className='group mt-3 pt-3 px-6 pb-6'
          >
            <CardTitle className='w-full underline-offset-4 decoration-yellow-400 decoration-2 group-hover:underline'>
              {newsItem.translations[0].title}
            </CardTitle>
            <CardDescription className='w-full group-hover:underline !no-underline'>
              {newsItem.translations[0].short_description}
            </CardDescription>
          </Link>
        </CardHeader>

        <CardFooter className='w-full flex justify-between items-center pb-0 mb-6'>
          <div className='flex items-center'>
            <Link
              href={
                newsItem.author.author_type === 'COMMITTEE'
                  ? 'chapter/committees/' +
                    (
                      newsItem.author as Committee
                    ).translations[0].title.toLocaleLowerCase()
                  : './chapter/students/' + (newsItem.author as Student).email
              }
            >
              <Avatar className='bg-white mr-2'>
                <AvatarImage
                  src={
                    newsItem.author.author_type === 'COMMITTEE'
                      ? (newsItem.author as Committee).logo_url
                      : (newsItem.author as Student).profile_picture_url
                  }
                />
                <AvatarFallback>
                  {newsItem.author.author_type === 'COMMITTEE'
                    ? (newsItem.author as Committee).translations[0].title +
                      ' logo'
                    : (newsItem.author as Student).first_name +
                      ' ' +
                      (newsItem.author as Student).last_name +
                      ' profile picture'}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <HoverCard>
                <HoverCardTrigger>
                  {newsItem.author.author_type === 'COMMITTEE'
                    ? (newsItem.author as Committee).translations[0].title
                    : (newsItem.author as Student).first_name +
                      ' ' +
                      (newsItem.author as Student).last_name}
                </HoverCardTrigger>
                <HoverCardContent>
                  {newsItem.author.author_type === 'COMMITTEE' ? (
                    <CommitteeTooltip
                      committee={newsItem.author as Committee}
                    />
                  ) : (
                    <StudentTooltip student={newsItem.author as Student} />
                  )}
                </HoverCardContent>
              </HoverCard>
              <span className='text-xs flex text-neutral-700 dark:text-neutral-400'>
                {newsItem.created_at}
              </span>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}
