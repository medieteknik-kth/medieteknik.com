import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import Student from '@/models/Student'
import { StudentTooltip } from '../tooltips/Tooltip'
import { Button } from '@components/ui/button'
import { forwardRef } from 'react'

export const StudentTag = forwardRef<
  HTMLButtonElement,
  {
    student: Student
    includeImage?: boolean
    includeAt?: boolean
    children?: React.ReactNode
  }
>(({ student, includeImage = true, includeAt = true, children }, ref) => {
  return (
    <HoverCard>
      <HoverCardTrigger className='flex items-center' asChild>
        <Button
          variant='link'
          className='h-fit text-inherit dark:text-yellow-400 py-0 px-1'
          style={{ fontSize: 'inherit' }}
          ref={ref}
        >
          {includeImage && (
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
          )}
          <p>
            {(includeAt ? '@ ' : '') +
              student.first_name +
              ' ' +
              student.last_name}
            {children}
          </p>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className='z-40'>
        <StudentTooltip student={student} />
      </HoverCardContent>
    </HoverCard>
  )
})
