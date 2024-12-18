'use client'

import { Button } from '@/components/ui/button'
import { LanguageCode } from '@/models/Language'
import Student from '@/models/Student'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { type JSX } from 'react'

interface Props {
  language: LanguageCode
  currentStudent: Student
}

/**
 * @name EditProfile
 * @description The edit profile button, which is only visible to the current student and any administators with the correct permissions
 *
 * @param {Props} props - The props
 * @param {LanguageCode} props.language - The language code
 * @param {Student} props.currentStudent - The current student
 * @returns {JSX.Element} The edit profile button
 */
export default function EditProfile({
  language,
  currentStudent,
}: Props): JSX.Element {
  const { student, permissions } = useAuthentication()

  if (!student) return <></>

  if (
    currentStudent !== student &&
    permissions.student &&
    !permissions.student.includes('STUDENT_EDIT')
  )
    return <></>

  return (
    <Button
      asChild
      variant='outline'
      className='text-foreground'
      title='Edit Profile'
      aria-label='Edit Profile'
    >
      <Link href='../account' className='flex items-center'>
        <Cog8ToothIcon className='w-6 h-6' />
        <p className='ml-2'>Edit Profile</p>
      </Link>
    </Button>
  )
}
