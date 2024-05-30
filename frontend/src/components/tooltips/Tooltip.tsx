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
              src={student.profilePictureUrl}
              alt='Profile Picture'
              width={96}
              height={96}
            />
            <AvatarFallback>Profile Picture</AvatarFallback>
          </Avatar>
          <p>{student.firstName + ' ' + student.lastName}</p>
        </Link>
      </Button>
      <Button
        variant='link'
        className='text-neutral-500 py-0 w-full left-0 right-0 mx-auto z-10'
      >
        <Link
          href={`mailto:${student.email}`}
          title={`Send email to ${student.firstName + ' ' + student.lastName}`}
          aria-label={`Send email to ${
            student.firstName + ' ' + student.lastName
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
        className='h-fit flex flex-col justify-center pb-0'
      >
        <Link
          href={`./chapter/committees/${committee.name.toLocaleLowerCase()}`}
          className='group'
        >
          <Avatar className='w-24 h-24 bg-white rounded-full mb-2 group-hover:scale-110 transition-transform'>
            <AvatarImage src={committee.logo_url} alt='Committee Logo' />
            <AvatarFallback>{committee.name + ' logo'}</AvatarFallback>
          </Avatar>
          <p>{committee.name}</p>
        </Link>
      </Button>
      <Button
        variant='link'
        className='text-neutral-500 py-0 w-full left-0 right-0 mx-auto z-10'
      >
        <Link
          href={`mailto:${committee.email}`}
          title={`Send email to ${committee.name}`}
          aria-label={`Send email to ${committee.name}`}
        >
          <span>{committee.email}</span>
        </Link>
      </Button>
      {/**TODO: Add description to committees, maybe own model? */}
      <p className='text-sm'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero enim
        architecto culpa, voluptas, nihil numquam quidem aliquam in dicta
        perferendis voluptates totam debitis, dignissimos doloribus. Repellat
        magnam laboriosam neque veritatis.
      </p>
    </div>
  )
}

export function CommitteePositionTooltip({
  position,
  committee,
}: {
  position: CommitteePosition
  committee: Committee
}) {
  return (
    <div>
      <CardHeader className='flex flex-row items-center'>
        <Avatar className='mr-2'>
          <AvatarImage src={committee.logo_url} alt='Committee Logo' />
          <AvatarFallback>Committee Picture</AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <CardTitle>{position.name}</CardTitle>
          <CardDescription className='capitalize'>
            {committee.name}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className='text-lg font-bold'>Description</h3>
        <p>{position.description}</p>
      </CardContent>
    </div>
  )
}
