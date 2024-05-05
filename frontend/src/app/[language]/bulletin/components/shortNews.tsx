import { ShortNewsItem } from '@/models/Items'
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

export default function ShortNews({ newsItem }: { newsItem: ShortNewsItem }) {
  return (
    <Card className='w-[600px] h-[200px] flex'>
      <Link
        href={`./bulletin/news/${newsItem.id}`}
        className='w-fit max-w-44 h-full p-5 pr-0 relative overflow-hidden'
        title={newsItem.title}
        aria-label={newsItem.title}
      >
        <Image
          src={newsItem.imageUrl}
          alt={newsItem.title}
          width={200}
          height={200}
          className='h-full w-auto rounded-xl object-cover'
        />
      </Link>

      <div className='grow flex flex-col justify-between'>
        <CardHeader className='w-fit h-fit p-0'>
          <Link
            href={`./bulletin/news/${newsItem.id}`}
            className='group mt-3 pt-3 px-6 pb-6'
          >
            <CardTitle className='w-full underline-offset-4 decoration-yellow-400 decoration-2 group-hover:underline'>
              {newsItem.title}
            </CardTitle>
            <CardDescription className='w-full group-hover:underline !no-underline'>
              {newsItem.shortDescription}
            </CardDescription>
          </Link>
        </CardHeader>

        <CardFooter className='w-full flex justify-between items-center pb-0 mb-6'>
          <div className='flex items-center'>
            <Link
              href={
                newsItem.author.type === 'committee'
                  ? 'chapter/committees/' +
                    (newsItem.author as Committee).name.toLocaleLowerCase()
                  : './chapter/students/' + (newsItem.author as Student).email
              }
            >
              <Avatar className='bg-white mr-2'>
                <AvatarImage
                  src={
                    newsItem.author.type === 'committee'
                      ? (newsItem.author as Committee).logoUrl
                      : (newsItem.author as Student).profilePictureUrl
                  }
                />
                <AvatarFallback>
                  {newsItem.author.type === 'committee'
                    ? (newsItem.author as Committee).name + ' logo'
                    : (newsItem.author as Student).firstName +
                      ' ' +
                      (newsItem.author as Student).lastName +
                      ' profile picture'}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <HoverCard>
                <HoverCardTrigger>
                  {newsItem.author.type === 'committee'
                    ? (newsItem.author as Committee).name
                    : (newsItem.author as Student).firstName +
                      ' ' +
                      (newsItem.author as Student).lastName}
                </HoverCardTrigger>
                <HoverCardContent>
                  {newsItem.author.type === 'committee' ? (
                    <CommitteeTooltip
                      committee={newsItem.author as Committee}
                    />
                  ) : (
                    <StudentTooltip student={newsItem.author as Student} />
                  )}
                </HoverCardContent>
              </HoverCard>
              <span className='text-xs flex text-neutral-700 dark:text-neutral-400'>
                {newsItem.creationDate}
              </span>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}
