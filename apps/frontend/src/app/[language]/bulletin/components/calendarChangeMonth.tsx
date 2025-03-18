'use client'

import { Button } from '@/components/ui/button'
import type { LanguageCode } from '@/models/Language'
import { useCalendar } from '@/providers/CalendarProvider'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { addMonths, subMonths } from 'date-fns'
import { useCallback } from 'react'


export default function CalendarChangeMonth() {
  const { date, setDate } = useCalendar()

  const handleNextMonth = useCallback(() => {
    if (new Date(date).getMonth() === addMonths(new Date(), 3).getMonth())
      return // Prevent going to the 6th month in the future

    setDate(addMonths(new Date(date), 1))
  }, [date, setDate])

  const handlePreviousMonth = useCallback(() => {
    if (new Date(date).getMonth() === new Date().getMonth()) return // Prevent going back to the current month

    setDate(subMonths(new Date(date), 1))
  }, [date, setDate])

  return (
    <>
      <Button
        size='icon'
        variant='outline'
        disabled={date.getMonth() === new Date().getMonth()}
        onClick={handlePreviousMonth}
      >
        <ChevronLeftIcon className='w-6 h-6' />
      </Button>
      <Button
        size='icon'
        variant='outline'
        disabled={date.getMonth() === addMonths(new Date(), 3).getMonth()}
        onClick={handleNextMonth}
      >
        <ChevronRightIcon className='w-6 h-6' />
      </Button>
    </>
  )
}
