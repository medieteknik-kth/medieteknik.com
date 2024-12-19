import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import type Student from '@/models/Student'
import Link from 'next/link'
import { forwardRef } from 'react'
import { StudentTooltip } from '../tooltips/Tooltip'

interface StudentTagProps {
  student: Student
  includeImage?: boolean
  includeAt?: boolean
  reverseImage?: boolean
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
const StudentTag = forwardRef<HTMLButtonElement, StudentTagProps>(
  (
    {
      student,
      includeImage = false,
      includeAt = false,
      reverseImage = false,
      children,
    },
    ref
  ) => {
    const username = `${student.first_name} ${student.last_name || ''}`
    return (
      <HoverCard>
        <HoverCardTrigger className='h-fit w-fit flex items-center' asChild>
          <Button
            variant='link'
            className={`h-fit text-inherit py-0 px-0 max-w-full ${
              reverseImage ? 'flex-row-reverse *:ml-2' : 'flex-row *:mr-2'
            }`}
            style={{ fontSize: 'inherit', lineHeight: 'inherit' }}
            ref={ref}
            tabIndex={-1}
            asChild
          >
            <Link href={`/student/${student.student_id}`}>
              {includeImage && (
                <Avatar className='h-10 w-auto aspect-square bg-white rounded-full overflow-hidden'>
                  <AvatarImage
                    className='h-10 w-auto aspect-square object-contain p-0.5 rounded-full'
                    src={student.profile_picture_url}
                    alt={username}
                  />
                  <AvatarFallback className='bg-primary text-black'>
                    {`${student.first_name.charAt(0)} ${student.last_name ? student.last_name.charAt(0) : ''}`}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className='flex flex-col items-start justify-center text-start overflow-hidden'>
                <p className='h-fit truncate max-w-full' title={username}>
                  {(includeAt ? '@ ' : '') + username}
                </p>
                <div className={`${children && 'leading-3'}`}>{children}</div>
              </div>
            </Link>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className='z-40'>
          <StudentTooltip student={student} />
        </HoverCardContent>
      </HoverCard>
    )
  }
)

StudentTag.displayName = 'StudentTag'
export default StudentTag
