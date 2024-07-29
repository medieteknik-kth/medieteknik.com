import Student from '@/models/Student'
import Committee, { CommitteePosition } from '@/models/Committee'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Button } from '@components/ui/button'
import FallbackImage from 'public/images/logo.webp'

export function StudentTooltip({ student }: { student: Student }) {
  return (
    <div>
      <Button
        asChild
        variant='link'
        className='h-fit flex flex-col justify-center pb-0'
      >
        <Link href='/' className='group' title='Go to profile page'>
          <Avatar className='w-24 h-24 bg-white rounded-full mb-2 group-hover:scale-110 transition-transform'>
            <AvatarImage
              src={student.profile_picture_url || FallbackImage.src}
              alt='Profile Picture'
              width={96}
              height={96}
            />
            <AvatarFallback>Profile Picture</AvatarFallback>
          </Avatar>
          <p>{student.first_name + ' ' + student.last_name}</p>
        </Link>
      </Button>
      <Button
        variant='link'
        className='w-full text-neutral-600 dark:text-neutral-300 py-0 left-0 right-0 mx-auto z-40'
      >
        <Link
          href={`mailto:${student.email}`}
          title={`Send email to ${
            student.first_name + ' ' + student.last_name
          }`}
          aria-label={`Send email to ${
            student.first_name + ' ' + student.last_name
          }`}
        >
          <span>{student.email}</span>
        </Link>
      </Button>
    </div>
  )
}

export function CommitteeTooltip({ committee }: { committee: Committee }) {
  return (
    <div>
      <Button
        asChild
        variant='link'
        className='h-fit flex flex-col justify-center pb-0 z-40 cursor-pointer'
      >
        <Link
          href={`/chapter/committees/${committee.translations[0].title.toLocaleLowerCase()}`}
          className='group'
        >
          <Avatar className='w-24 h-24 bg-white rounded-full mb-2 group-hover:scale-110 transition-transform'>
            <AvatarImage src={committee.logo_url} alt='Committee Logo' />
            <AvatarFallback>
              {committee.translations[0].title + ' logo'}
            </AvatarFallback>
          </Avatar>
          <p>{committee.translations[0].title}</p>
        </Link>
      </Button>
      <Button
        variant='link'
        className='text-neutral-500 py-0 w-full left-0 right-0 mx-auto z-10'
      >
        <Link
          href={`mailto:${committee.email}`}
          title={`Send email to ${committee.translations[0].title}`}
          aria-label={`Send email to ${committee.translations[0].title}`}
        >
          <span>{committee.email}</span>
        </Link>
      </Button>
      <p className='text-sm'>{committee.translations[0].description}</p>
    </div>
  )
}

export function CommitteePositionTooltip({
  position,
}: {
  position: CommitteePosition
}) {
  return (
    <div>
      <CardHeader className='flex flex-row items-center'>
        <Avatar className='mr-2'>
          <AvatarImage
            src={position.committee_logo_url || ''}
            alt='Committee Logo'
          />
          <AvatarFallback>N/A</AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <CardTitle>{position.translations[0].title}</CardTitle>
          <CardDescription className='capitalize'>
            {position.category}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className='text-lg font-bold'>Description</h3>
        <p>{position.translations[0].description}</p>
      </CardContent>
    </div>
  )
}
