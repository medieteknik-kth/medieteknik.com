'use client'

import Calendar from '@/components/calendar/Calendar'
import type { LanguageCode } from '@/models/Language'

import type { JSX } from 'react'

interface Props {
  language: LanguageCode
}

import type { JSX } from 'react'

interface Props {
  language: string
}

/**
 * @name CalendarPage
 * @description The page for managing a committees calendar
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 *
 * @returns {JSX.Element} The rendered component
 * @deprecated This page is not used (yet)
 */
export default function CalendarPage({ language }: Props): JSX.Element {
  return (
    <section className='grow'>
      <h2 className='text-2xl py-3 border-b-2 border-yellow-400 mb-4'>
        Calendar
      </h2>
      <Calendar language={language} />
    </section>
  )
}
