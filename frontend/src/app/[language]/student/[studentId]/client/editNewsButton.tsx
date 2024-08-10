'use client'
import { Button } from '@/components/ui/button'
import Student from '@/models/Student'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { Cog8ToothIcon } from '@heroicons/react/24/outline'

export default function EditNewsButton({
  language,
  currentStudent,
}: {
  language: string
  currentStudent: Student
}) {
  const { student } = useAuthentication()

  if (!student) return <></>
  if (currentStudent.student_id !== student.student_id) return <></>

  return (
    <Button size='icon' title='Edit News' aria-label='Edit News'>
      <Cog8ToothIcon className='w-6 h-6' />
    </Button>
  )
}
