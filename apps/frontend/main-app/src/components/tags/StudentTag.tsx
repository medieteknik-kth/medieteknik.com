'use client'

import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import type { LanguageCode } from '@/models/Language'
import type Student from '@/models/Student'
import { useStudent } from '@/providers/AuthenticationProvider'
import { Link } from 'next-view-transitions'
import Image from 'next/image'
import { forwardRef } from 'react'
import { StudentTooltip } from '../tooltips/Tooltip'

interface StudentTagProps {
  student: Student
  language: LanguageCode
  includeImage?: boolean
  includeAt?: boolean
  reverseImage?: boolean
  size?: number
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
      language,
      includeImage = false,
      includeAt = false,
      reverseImage = false,
      size = 40,
      children,
    },
    ref
  ) => {
    const username = `${student.first_name} ${student.last_name || ''}`
    const { student: authStudent } = useStudent()
    return (
      <HoverCard openDelay={350}>
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
            <Link
              href={`/${language}/student/${student.student_id}`}
              className='group'
              style={{
                textDecoration: 'none',
              }}
            >
              {includeImage &&
                (student.profile_picture_url ? (
                  <Image
                    className='object-contain rounded-full bg-white dark:bg-gray-800'
                    style={{
                      height: size,
                      width: size,
                    }}
                    width={size}
                    height={size}
                    src={student.profile_picture_url}
                    alt={username}
                  />
                ) : (
                  <p
                    className={`p-0.5 rounded-full bg-yellow-400 grid place-items-center select-none no-underline! font-bold ${size > 40 ? ' text-base' : 'text-xs'}`}
                    style={{
                      height: size,
                      width: size,
                    }}
                  >
                    {`${student.first_name.charAt(0)}${student.last_name ? student.last_name.charAt(0) : ''}`}
                  </p>
                ))}
              <div
                className={`flex flex-col ${reverseImage ? 'items-end' : 'items-start'} justify-center text-start  overflow-x-auto`}
              >
                <p
                  className='h-fit truncate max-w-full group-hover:underline'
                  title={username}
                >
                  {(includeAt ? '@ ' : '') + username}
                  {authStudent &&
                    student.student_id === authStudent.student_id && (
                      <span className='text-xs text-muted-foreground select-none'>
                        &nbsp;{language === 'en' ? '(You)' : '(Du)'}
                      </span>
                    )}
                </p>
                <div className={`${children && 'leading-3'}`}>{children}</div>
              </div>
            </Link>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className='z-40 w-fit'>
          <StudentTooltip student={student} language={language} />
        </HoverCardContent>
      </HoverCard>
    )
  }
)

StudentTag.displayName = 'StudentTag'
export default StudentTag
