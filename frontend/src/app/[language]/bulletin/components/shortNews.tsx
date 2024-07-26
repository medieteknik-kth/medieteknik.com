import { News } from '@/models/Items'
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import Link from 'next/link'
import Image from 'next/image'
import { StudentTooltip, CommitteeTooltip } from '@/components/tooltips/Tooltip'
//TODO: Remove Later
import FallbackImage from 'public/images/logo.webp'
import { StudentTag } from '@/components/tags/StudentTag'
import { CommitteeTag } from '@/components/tags/CommitteeTag'
import CommitteePositionTag from '@/components/tags/CommitteePositionTag'

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
          src={newsItem.translations[0].main_image_url || FallbackImage.src}
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

        <CardFooter className='w-full flex justify-between items-center pb-0 mb-6 max-w-[325px]'>
          {newsItem.author.author_type === 'STUDENT' ? (
            <StudentTag student={newsItem.author as Student} includeAt={false}>
              <span className='text-xs text-neutral-700'>
                {newsItem.created_at}
              </span>
            </StudentTag>
          ) : newsItem.author.author_type === 'COMMITTEE' ? (
            <CommitteeTag
              committee={newsItem.author as Committee}
              includeAt={false}
              includeBackground={false}
            >
              <span className='text-xs text-neutral-700'>
                {newsItem.created_at}
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
