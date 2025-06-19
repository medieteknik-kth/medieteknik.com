'use client'

import CalendarChangeMonth from '@/app/[language]/bulletin/components/calendarChangeMonth'
import DetailedEvent from '@/app/[language]/bulletin/components/detailedEvent'
import { useTranslation } from '@/app/i18n/client'
import Calendar from '@/components/calendar/Calendar'
import { Dialog } from '@/components/ui/dialog'
import type { LanguageCode } from '@/models/Language'
import type Event from '@/models/items/Event'
import { useStudent } from '@/providers/AuthenticationProvider'
import { useCalendar } from '@/providers/CalendarProvider'
import { type JSX, useState } from 'react'
import CalendarExport from '../components/calendarExport'

/**
 * Render the events section of the bulletin
 * @name Events
 * @description Renders the event section of the bulletin.
 *
 * @param {string} language - The language of the page
 *
 * @returns {JSX.Element} The events section
 */
export default function Events({
  language,
}: {
  language: LanguageCode
}): JSX.Element {
  const { student } = useStudent()
  const { date } = useCalendar()
  const [detailedEventOpen, setDetailedEventOpen] = useState<Event | undefined>(
    undefined
  )

  const { t } = useTranslation(language, 'bulletin')

  return (
    <section id='calendar' className='w-full desktop:w-fit h-fit'>
      <>
        <h2 className='uppercase text-neutral-600 dark:text-neutral-400 tracking-wide select-none leading-4'>
          {t('calendar')}
        </h2>
        <p className='text-2xl font-bold mb-3'>
          {new Date(date).toLocaleDateString(language, {
            year: 'numeric',
            month: 'long',
          })}
        </p>
      </>

      <Calendar
        language={language}
        onEventClickCallback={(event) => setDetailedEventOpen(event)}
      >
        <div className='absolute right-0 -top-12 flex gap-2'>
          <CalendarChangeMonth />
          {student && <CalendarExport student={student} />}
        </div>
      </Calendar>

      {detailedEventOpen && (
        <Dialog
          open={!!detailedEventOpen}
          onOpenChange={() => setDetailedEventOpen(undefined)}
        >
          <DetailedEvent
            language={language}
            event={detailedEventOpen}
            closeDialog={() => setDetailedEventOpen(undefined)}
          />
        </Dialog>
      )}
    </section>
  )
}
