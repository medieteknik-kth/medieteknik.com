'use client'
import Loading from '@/components/tooltips/Loading'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Profile({
  params: { language },
}: {
  params: { language: string }
}) {
  const router = useRouter()
  const { student } = useAuthentication()

  useEffect(() => {
    if (!student) {
      router.push(`/${language}/login`)
    } else {
      router.push(`/${language}/student/${student.student_id}`)
    }
  }, [student, router])

  return <Loading language={language} />
}
