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
import Image from 'next/image'
import Link from 'next/link'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { StudentTooltip, CommitteeTooltip } from '@/components/tooltips/Tooltip'

export default function NewsCard({ newsItem }: { newsItem: ShortNewsItem }) {
  return (
    <Card
      className='w-fit h-full flex flex-col justify-between'
      title={newsItem.title}
      aria-label={newsItem.title}
    >
      <CardHeader>
        <Link href={'./news/' + newsItem.id} className='group w-full h-20'>
          <Image
            src={newsItem.imageUrl}
            alt={newsItem.title + ' Image'}
            width={300}
            height={100}
            className='object-cover w-full h-full'
          />

          <CardTitle className='py-2 underline-offset-4 decoration-yellow-400 decoration-2 group-hover:underline'>
            {newsItem.title}
          </CardTitle>
          <CardDescription className='max-h-24 text-ellipsis overflow-y-hidden group-hover:underline !no-underline'>
            {newsItem.shortDescription}
          </CardDescription>
        </Link>
      </CardHeader>

      <CardFooter className='flex flex-col items-start relative'>
        <div className='flex mb-2'>
          <Link
            href={
              '../' +
              (newsItem.author.type === 'committee'
                ? 'chapter/committees/' +
                  (newsItem.author as Committee).name.toLocaleLowerCase()
                : 'student/' + (newsItem.author as Student).email)
            }
          >
            <Avatar>
              <AvatarImage
                src={
                  newsItem.author.type === 'committee'
                    ? (newsItem.author as Committee).logoUrl
                    : (newsItem.author as Student).profilePictureUrl
                }
                alt='Author Picture'
              />
              <AvatarFallback>Author Picture</AvatarFallback>
            </Avatar>
          </Link>
          <div className='flex flex-col justify-center ml-2'>
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
                  <CommitteeTooltip committee={newsItem.author as Committee} />
                ) : (
                  <StudentTooltip student={newsItem.author as Student} />
                )}
              </HoverCardContent>
            </HoverCard>
            <span className='text-xs flex text-neutral-700 dark:text-neutral-400'>
              {new Date(newsItem.creationDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
