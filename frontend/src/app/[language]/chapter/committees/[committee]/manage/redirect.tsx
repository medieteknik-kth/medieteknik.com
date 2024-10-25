'use client'

import Loading from '@/components/tooltips/Loading'
import Committee from '@/models/Committee'
import { Permission, Role } from '@/models/Permission'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type JSX } from 'react'
import CommitteeLandingPage from './landing'

interface Props {
  language: string
  committee: string
  committeeName: string
  committeeData: Committee
}

/**
 * @name CommitteeRedirect
 * @description The page for redirecting in-case the user is not allowed to manage the committee
 *
 * @param {object} param - The dynamic URL parameters
 * @param {string} param.language - The language of the page
 * @param {string} param.committee - The committee name to manage
 *
 * @returns {JSX.Element} The rendered component
 */
export default function CommitteeRedirect({
  language,
  committee,
  committeeName,
  committeeData,
}: Props): JSX.Element {
  const {
    committees,
    role,
    permissions,
    isLoading: authLoading,
  } = useAuthentication()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (
      !(
        committees && committees.some((c) => c.email === committeeData.email)
      ) &&
      !(
        role === Role.ADMIN ||
        (permissions.student &&
          permissions.student.includes(Permission.COMMITTEE_EDIT))
      )
    ) {
      router.push(`/${language}/chapter/committees/${committee}`)
    } else {
      setIsLoading(false)
    }
  }, [
    committees,
    role,
    permissions,
    authLoading,
    committee,
    committeeData.email,
    language,
    router,
  ])

  if (isLoading || authLoading) {
    return <Loading language={language} />
  }

  return (
    <CommitteeLandingPage
      language={language}
      committeeData={committeeData}
      committeeName={committeeName}
    />
  )
}
