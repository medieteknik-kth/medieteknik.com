import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type Committee from '@/models/Committee'
import type { CommitteePosition } from '@/models/Committee'
import type Student from '@/models/Student'
import Image from 'next/image'
import Link from 'next/link'
import FallbackImage from 'public/images/logo.webp'

export function StudentTooltip({ student }: { student: Student }) {
  const username = `${student.first_name} ${student.last_name || ''}`
  return (
    <>
      <Button
        asChild
        variant='link'
        className='h-fit flex flex-col justify-center pb-0'
      >
        <Link
          href={`./student/${student.student_id}`}
          className='group'
          title='Go to profile page'
        >
          <Avatar className='w-24 h-auto aspect-square bg-white rounded-full mb-2 group-hover:scale-110 transition-transform overflow-hidden'>
            <AvatarImage
              src={student.profile_picture_url}
              alt='Profile Picture'
              width={96}
              height={96}
              className='w-24 h-auto aspect-square object-fill p-0.5 rounded-full'
            />
            <AvatarFallback className='bg-white'>
              <Image
                src={FallbackImage.src}
                alt='Profile Picture'
                width={72}
                height={72}
                className='w-24 h-auto aspect-square object-cover p-4'
              />
            </AvatarFallback>
          </Avatar>
          <p>{username}</p>
        </Link>
      </Button>
      <Button
        variant='link'
        className='w-full text-neutral-600 dark:text-neutral-300 py-0 left-0 right-0 mx-auto z-40'
      >
        <Link
          href={`mailto:${student.email}`}
          title={`Send email to ${username}`}
          aria-label={`Send email to ${username}`}
        >
          <span>{student.email}</span>
        </Link>
      </Button>
    </>
  )
}

export function CommitteeTooltip({ committee }: { committee: Committee }) {
  return (
    <>
      {!committee.hidden ? (
        <Button
          asChild
          variant='link'
          className='h-fit flex flex-col justify-center pb-0 z-40 cursor-pointer'
        >
          <Link
            href={`/chapter/committees/${committee.translations[0].title.toLocaleLowerCase()}`}
            className='group'
          >
            <Avatar className='w-24 h-24 bg-white group-hover:scale-105 transition-transform rounded-full overflow-hidden'>
              <AvatarImage
                src={committee.logo_url}
                width={128}
                height={128}
                className='h-24 w-auto object-contain p-3.5'
              />
              <AvatarFallback>
                {`${committee.translations[0].title} logo`}
              </AvatarFallback>
            </Avatar>
            <p>{committee.translations[0].title}</p>
          </Link>
        </Button>
      ) : (
        <div className='h-fit flex flex-col justify-center items-center pb-0 z-40'>
          <Avatar className='w-24 h-24 bg-white rounded-full overflow-hidden'>
            <AvatarImage
              src={committee.logo_url}
              width={128}
              height={128}
              className='h-24 w-auto object-contain p-3.5'
            />
            <AvatarFallback>
              {`${committee.translations[0].title} logo`}
            </AvatarFallback>
          </Avatar>
          <p>{committee.translations[0].title}</p>
        </div>
      )}

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
      <p className='text-sm text-wrap font-normal'>
        {committee.translations[0].description}
      </p>
    </>
  )
}

export function CommitteePositionTooltip({
  position,
}: {
  position: CommitteePosition
}) {
  return (
    <>
      <div className='w-fit flex items-center gap-2 py-2'>
        {position.committee && (
          <Avatar className='mr-2 bg-white rounded-md overflow-hidden border'>
            <AvatarImage
              src={position.committee.logo_url}
              alt='Committee Logo'
              className='w-full h-full object-contain p-0.5'
            />
          </Avatar>
        )}

        <div className='flex flex-col w-fit'>
          <p className='font-bold'>{position.translations[0].title}</p>
          <p className='text-sm text-muted-foreground'>{position.category}</p>
        </div>
      </div>
      <div>
        <p className='text-sm min-w-72 max-w-[350px] whitespace-pre-wrap'>
          {position.translations[0].description}
        </p>
      </div>
    </>
  )
}
