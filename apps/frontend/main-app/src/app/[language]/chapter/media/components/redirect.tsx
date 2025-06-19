'use client'

import Loading from '@/components/tooltips/Loading'
import type { LanguageCode } from '@/models/Language'
import { useRouter } from 'next/navigation'
import { type JSX, useEffect } from 'react'

interface Props {
  language: LanguageCode
}

/**
 * @name Redirect
 * @description Redirect to the media page for any error or invalid route
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 *
 * @returns {JSX.Element} The redirect component
 */
export default function Redirect({ language }: Props): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    router.push(`/${language}/chapter/media`)
  }, [router, language])

  return <Loading language={language} />
}
