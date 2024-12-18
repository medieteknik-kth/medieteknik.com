'use client'
import Loading from '@/components/tooltips/Loading'
import { LanguageCode } from '@/models/Language'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { useRouter } from 'next/navigation'
import { use, useEffect, type JSX } from 'react'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

/**
 * @name Profile
 * @description Redirects to the relevant student profile page
 *
 * @param {object} params - The dynamic route parameters
 * @param {string} params.language - The language code
 * @returns {JSX.Element} The profile page
 */
export default function Profile(props: Props): JSX.Element {
  const { language } = use(props.params)
  const router = useRouter()
  const { student } = useAuthentication()

  useEffect(() => {
    if (!student) {
      router.push(`/${language}/login`)
    } else {
      router.push(`/${language}/student/${student.student_id}`)
    }
  }, [student, router, language])

  return <Loading language={language} />
}
