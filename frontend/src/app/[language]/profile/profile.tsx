'use client'

import Loading from '@/components/tooltips/Loading'
import type { LanguageCode } from '@/models/Language'
import { useStudent } from '@/providers/AuthenticationProvider'
import { useRouter } from 'next/navigation'
import { type JSX, use, useEffect } from 'react'

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
  const { student } = useStudent()

  useEffect(() => {
    if (!student) {
      router.replace(`/${language}/login`)
    } else {
      router.replace(`/${language}/student/${student.student_id}`)
    }
  }, [student, router, language])

  return <Loading language={language} />
}
