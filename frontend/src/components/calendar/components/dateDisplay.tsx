'use client'
import EventComponent from '@/components/calendar/components/eventDisplay'
import type Event from '@/models/items/Event'
import { useCalendar } from '@/providers/CalendarProvider'
import { isSameDay, isSameMonth } from 'date-fns'

import type { JSX } from 'react'

interface Props {
  date: Date
  events: Event[]
  currentMonth: boolean
  onEventClickCallback: (e: Event) => void
  onDateClickCallback: (date: Date) => void
}

/**
 * Sorts events based on the duration in descending order and then by start date in ascending order.
 *
 * @param {Event[]} events - The list of events to be sorted.
 * @return {Event[]} The sorted list of events.
 */
const sortEvents = (events: Event[]): Event[] =>
  events.sort((a, b) => {
    const durationA =
      new Date(
        new Date(a.start_date).getTime() + a.duration * 60_000
      ).getTime() - new Date(a.start_date).getTime()
    const durationB =
      new Date(
        new Date(b.start_date).getTime() + b.duration * 60_000
      ).getTime() - new Date(b.start_date).getTime()

    // TODO: Add better styling instead of priority sorting

    if (durationA !== durationB) {
      return durationB - durationA
    }

    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  })

/**
 * Filters events based on the provided date.
 *
 * @param {Event[]} events - The list of events to filter.
 * @param {Date} date - The date to filter events for.
 * @return {Event[]} The filtered list of events for the given date.
 */
const filterEventsForDate = (events: Event[], date: Date): Event[] =>
  events.filter((event) => {
    const startDate = new Date(event.start_date)
    const endDate = new Date(startDate.getTime() + event.duration * 60_000)

    return (
      isSameDay(startDate, date) ||
      isSameDay(endDate, date) ||
      (date > startDate && date < endDate)
    )
  })

/**
 * @name DateComponent
 * @description This component is used to display a date in the calendar.
 *
 * @param {Props} props
 * @param {Date} props.date - The date to display.
 * @param {Event[]} props.events - The list of events for the date.
 * @param {boolean} props.currentMonth - Whether the date is in the current month.
 * @param {(e: Event) => void} props.onEventClickCallback - The callback function when an event is clicked.
 * @param {(date: Date) => void} props.onDateClickCallback - The callback function when the date is clicked.
 *
 * @returns {JSX.Element} The date component.
 */
export default function DateComponent({
  date,
  events,
  currentMonth,
  onEventClickCallback,
  onDateClickCallback,
}: Props): JSX.Element {
  const currentDate = new Date()
  const { selectedDate, setSelectedDate } = useCalendar()

  return (
    <li
      className={`w-full desktop:w-48 h-32 border-r relative cursor-pointer ${
        currentMonth
          ? `${
              isSameDay(selectedDate, date)
                ? 'bg-yellow-400/25 hover:bg-yellow-400/40'
                : 'bg-white dark:bg-[#111] hover:bg-neutral-200/75 dark:hover:bg-neutral-700/75'
            } `
          : `${
              isSameDay(selectedDate, date)
                ? 'bg-yellow-400/25 hover:bg-yellow-400/40'
                : 'bg-neutral-100 dark:bg-[#222] hover:bg-neutral-300/75 dark:hover:bg-neutral-700/75'
            }`
      }`}
      onKeyDown={(event) => {
        event.stopPropagation()
        if (event.key === 'Enter') {
          setSelectedDate(date)
          onDateClickCallback(date)
        }
      }}
      onClick={(event) => {
        event.stopPropagation()
        setSelectedDate(date)
        onDateClickCallback(date)
      }}
    >
      <p
        className={`absolute top-2 left-2 text-md sm:text-2xl select-none z-10 ${
          currentMonth
            ? currentDate.getDate() === date.getDate() &&
              isSameMonth(date, currentDate)
              ? 'text-red-700 dark:text-red-400'
              : 'text-neutral-700 dark:text-neutral-300'
            : 'text-neutral-600 dark:text-neutral-400'
        }`}
      >
        {date.getDate()}
      </p>
      <div className='w-full mt-10 text-black font-bold px-1 sm:px-2 max-h-[80px] overflow-y-auto overflow-x-clip'>
        <ul className='flex flex-col gap-1 h-fit'>
          {filterEventsForDate(sortEvents(events), date).map((event, index) => (
            <EventComponent
              key={event.event_id}
              date={date}
              event={event}
              index={index}
              onEventClick={onEventClickCallback}
            />
          ))}
        </ul>
      </div>
    </li>
  )
}
