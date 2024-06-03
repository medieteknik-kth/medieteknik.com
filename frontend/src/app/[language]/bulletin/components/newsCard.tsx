import News from '@/models/Items'
import Committee, { CommitteePosition } from '@models/Committee'
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

export default function NewsCard({ newsItem }: { newsItem: News }) {
  return (
    <Card
      className='w-full h-full flex flex-col justify-between'
      title={newsItem.translation.title}
      aria-label={newsItem.translation.title}
    >
      <CardHeader>
        <Link href={'./news/' + newsItem.url} className='group w-full h-20'>
          {newsItem.translation.main_image_url ? (
            <Image
              src={newsItem.translation.main_image_url}
              alt={newsItem.translation.title + ' Image'}
              width={300}
              height={100}
              className='object-cover w-full h-full'
            />
          ) : (
            <div className='w-full h-[100px] bg-blue-400' />
          )}

          <CardTitle className='py-2 underline-offset-4 decoration-yellow-400 decoration-2 group-hover:underline'>
            {newsItem.translation.title}
          </CardTitle>
          <CardDescription className='max-h-24 text-ellipsis overflow-y-hidden group-hover:underline !no-underline'>
            {newsItem.translation.short_description}
          </CardDescription>
        </Link>
      </CardHeader>

      <CardFooter className='flex flex-col items-start relative'>
        <div className='flex mb-2'>
          <Link
            href={
              '../' +
              (newsItem.author.type === 'COMMITTEE'
                ? 'chapter/committees/' +
                  (newsItem.author as Committee).title.toLocaleLowerCase()
                : 'student/' + (newsItem.author as Student).email)
            }
          >
            <Avatar className='w-8 h-8'>
              <AvatarImage
                src={
                  newsItem.author.type === 'COMMITTEE'
                    ? (newsItem.author as Committee).logo_url
                    : (newsItem.author as Student).profile_picture_url
                  // TODO: Add support for CommitteePosition, image is the committee
                }
                alt='Author Picture'
              />
              <AvatarFallback>Author Picture</AvatarFallback>
            </Avatar>
          </Link>
          <div className='flex flex-col justify-center ml-2'>
            <HoverCard>
              <HoverCardTrigger className='max-w-[175px] text-sm truncate overflow-x-hidden text-ellipsis'>
                {newsItem.author.type === 'COMMITTEE'
                  ? (newsItem.author as Committee).title
                  : newsItem.author.type === 'COMMITTEE_POSITION'
                  ? (newsItem.author as CommitteePosition).title
                  : (newsItem.author as Student).first_name +
                    ' ' +
                    (newsItem.author as Student).last_name}
              </HoverCardTrigger>
              <HoverCardContent>
                {newsItem.author.type === 'COMMITTEE' ? (
                  <CommitteeTooltip committee={newsItem.author as Committee} />
                ) : (
                  <StudentTooltip student={newsItem.author as Student} />
                )}
              </HoverCardContent>
            </HoverCard>
            <span className='text-xs flex text-neutral-700 dark:text-neutral-400'>
              {new Date(newsItem.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
