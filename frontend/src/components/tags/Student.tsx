import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import Student from '@/models/Student'
import { StudentTooltip } from '../tooltips/Tooltip'
import { Button } from '@components/ui/button'

export default function StudentTag({
  language,
  student,
  includeAt = true,
}: {
  language: string
  student: Student
  includeAt: boolean
}) {
  return (
    <HoverCard>
      <HoverCardTrigger className='flex items-center' asChild>
        <Button variant='link' className='text-black pl-0'>
          <Avatar className='w-8 h-8 mr-2'>
            <AvatarImage
              src={student.profile_picture_url ?? ''}
              alt={student.first_name + ' ' + student.last_name}
            />
            <AvatarFallback>
              {student.first_name +
                ' ' +
                student.last_name +
                ' Profile Picture'}
            </AvatarFallback>
          </Avatar>
          <p>
            {(includeAt ? '@ ' : '') +
              student.first_name +
              ' ' +
              student.last_name}
          </p>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <StudentTooltip student={student} />
      </HoverCardContent>
    </HoverCard>
  )
}
