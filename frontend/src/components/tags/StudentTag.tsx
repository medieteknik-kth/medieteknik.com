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
import FallbackImage from 'public/images/logo.webp'

interface StudentTagProps {
  student: Student
  includeImage?: boolean
  includeAt?: boolean
  children?: React.ReactNode
}

/**
 * @name StudentTag
 * @description A tag component for students
 *
 * @param {StudentTagProps} props - The props for the component
 * @param {Student} props.student - The student to display
 * @param {boolean} props.includeImage - Whether to include the image
 * @param {boolean} props.includeAt - Whether to include the @ symbol
 * @param {React.ReactNode} props.children - The children
 *
 * @returns {ForwardRefExoticComponent<StudentTagProps & RefAttributes<HTMLButtonElement>>} The component
 */
export const StudentTag = forwardRef<HTMLButtonElement, StudentTagProps>(
  ({ student, includeImage = true, includeAt = true, children }, ref) => {
    return (
      <HoverCard>
        <HoverCardTrigger className='flex items-center' asChild>
          <Button
            variant='link'
            className='h-fit text-inherit dark:text-yellow-400 py-0 px-1 max-w-full'
            style={{ fontSize: 'inherit' }}
            ref={ref}
          >
            {includeImage && (
              <Avatar className='w-10 h-10 mr-2'>
                <AvatarImage
                  src={student.profile_picture_url || FallbackImage.src}
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
            <div className='flex flex-col text-start overflow-hidden '>
              <p className='truncate max-w-full'>
                {(includeAt ? '@ ' : '') +
                  student.first_name +
                  ' ' +
                  student.last_name}
              </p>
              {children}
            </div>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className='z-40'>
          <StudentTooltip student={student} />
        </HoverCardContent>
      </HoverCard>
    )
  }
)
