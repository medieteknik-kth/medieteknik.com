'use client'
import Calendar from '@/components/calendar/Calendar'

import type { JSX } from 'react'

/**
 * @name CalendarPage
 * @description The page for managing a committees calendar
 *
 * @param {string} language - The language of the page
 * @returns {JSX.Element} The rendered component
 * @deprecated This page is not used
 */
export default function CalendarPage({
  language,
}: {
  language: string
}): JSX.Element {
  return (
    <section className='grow'>
      <h2 className='text-2xl py-3 border-b-2 border-yellow-400 mb-4'>
        Calendar
      </h2>
      <Calendar language={language} />
    </section>
  )
}
