'use client'

import { Button } from '@/components/ui/button'
import Student from '@/models/Student'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function EditProfile({
  language,
  currentStudent,
}: {
  language: string
  currentStudent: Student
}) {
  const { student, permissions } = useAuthentication()

  if (!student) return <></>

  if (
    currentStudent !== student &&
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
