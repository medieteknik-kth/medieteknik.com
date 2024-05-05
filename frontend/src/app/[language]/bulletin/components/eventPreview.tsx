import { Event } from '@/models/Items'
import Committee from '@models/Committee'
import Student from '@models/Student'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
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
import BG from 'public/images/kth-landskap.jpg'
import { CommitteeTooltip, StudentTooltip } from '@/components/tooltips/Tooltip'

export default function EventPreview({
  language,
  event,
}: {
  language: string
  event: Event
}) {
  return (
    <div className='w-full h-full'>
      <div className='w-full h-full relative -z-20 rounded-l-xl overflow-hidden'>
        <div className='w-full h-full absolute bg-black/50' />
        <Image
          src={event.imageUrl || BG.src}
          width={1080}
          height={720}
          alt='Event image'
          priority
          loading='eager'
          className='w-auto 2xl:w-full h-full 2xl:h-auto object-cover -z-20 absolute top-0 left-0 right-0 bottom-0 m-auto'
        />
        <div className='w-full h-1.5 absolute bottom-0 bg-white/50 z-10' />
      </div>
      <Card className='min-w-72 w-1/4 h-fit absolute bottom-10 left-20'>
        <CardHeader>
          {event.categories.map((category) => (
            <Badge key={category} className='w-fit mr-2'>
              {category}
            </Badge>
          ))}

          <CardTitle>
            <Link
              href={`./chapter/events/${event.id}`}
              className='hover:underline underline-offset-4 decoration-yellow-400 decoration-2'
            >
              {event.title}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <div className='flex items-center'>
            <Link href='./chapter/committees/styrelsen' className='mr-2'>
              {event.author.type === 'committee' ? (
                <Avatar>
                  <AvatarImage src={(event.author as Committee).logoUrl} />
                  <AvatarFallback>
                    {(event.author as Committee).name + ' logo'}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar>
                  <AvatarImage
                    src={(event.author as Student).profilePictureUrl}
                  />
                  <AvatarFallback>
                    {(event.author as Student).firstName + ' profile picture'}
                  </AvatarFallback>
                </Avatar>
              )}
            </Link>
            <HoverCard>
              <HoverCardTrigger asChild>
                {event.author.type === 'committee' ? (
                  <Link
                    href={`./chapter/committees/${(
                      event.author as Committee
                    ).name.toLocaleLowerCase()}`}
                  >
                    {(event.author as Committee).name}
                  </Link>
                ) : (
                  <Link href='./chapter/students/johndoe'>
                    {(event.author as Student).firstName +
                      ' ' +
                      (event.author as Student).lastName}
                  </Link>
                )}
              </HoverCardTrigger>
              <HoverCardContent>
                {event.author.type === 'committee' ? (
                  <CommitteeTooltip committee={event.author as Committee} />
                ) : (
                  <StudentTooltip student={event.author as Student} />
                )}
              </HoverCardContent>
            </HoverCard>
          </div>
        </CardFooter>
      </Card>

      <Card className='h-24 aspect-square absolute top-10 right-[120px] text-center'>
        <CardHeader>
          <CardTitle>{new Date(event.startDate).getDay()}</CardTitle>
          <CardDescription className='uppercase'>
            {new Date(event.startDate).toLocaleString(undefined, {
              month: 'short',
            })}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
