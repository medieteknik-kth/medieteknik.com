'use client'
import Loading from '@/components/tooltips/Loading'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface Props {
  params: {
    language: string
  }
}

/**
 * @name Profile
 * @description Redirects to the relevant student profile page
 *
 * @param {object} params - The dynamic route parameters
 * @param {string} params.language - The language code
 * @returns {JSX.Element} The profile page
 */
export default function Profile({ params: { language } }: Props): JSX.Element {
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
