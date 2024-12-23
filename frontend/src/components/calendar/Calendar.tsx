import DateComponent from '@/components/calendar/components/dateDisplay'
import type { LanguageCode } from '@/models/Language'
import type Event from '@/models/items/Event'
import { useCalendar } from '@/providers/CalendarProvider'
import { LANGUAGES } from '@/utility/Constants'
import { addMonths, getDaysInMonth, setDate } from 'date-fns'
import { type JSX, useMemo } from 'react'
import './calendar.css'
import { getPreviousMonthLastWeekToCurrent } from './util'

interface Props {
  language: LanguageCode
  onDateClickCallback?: (date: Date) => void
  onEventClickCallback?: (event: Event) => void
  children?: React.ReactNode
}

/**
 * @name Calendar
 * @description This component is used to display a calendar. It displays an entire month with all the dates and events.
 *
 * @param {Props} props
 * @param {string} props.language - The language of the calendar.
 * @param {(date: Date) => void} props.onDateClickCallback - The callback function when a date is clicked.
 * @param {(event: Event) => void} props.onEventClickCallback - The callback function when an event is clicked.
 * @param {React.ReactNode} props.children - The children of the component.
 *
 * @returns {JSX.Element} The calendar component.
 */
export default function Calendar({
  language,
  onDateClickCallback,
  onEventClickCallback,
  children,
}: Props): JSX.Element {
  const { date, setSelectedDate, events } = useCalendar()
  const totalDays = useMemo(() => getDaysInMonth(new Date(date)), [date])
  const previousMonthLastWeek = useMemo(
    () => getPreviousMonthLastWeekToCurrent(date),
    [date]
  )

  const MAX_NEXT_MONTH_DAYS = 14
  const en_days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const sv_days = ['Mon', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön']

  return (
    <div
      id='calendar'
      className='w-full desktop:w-[1345px] h-fit min-h-[750px] relative'
      aria-label='Calendar'
    >
      <ul className='w-full desktop:w-fit grid grid-cols-7 grid-rows-1 font-bold text-lg border-l border-t rounded-t'>
        {language === LANGUAGES.en.short_name
          ? en_days.map((day) => (
              <li
                key={day}
                className='week w-full desktop:w-48 py-1 px-0 xs:px-2 sm:pl-2 border-r border-inherit grid place-items-center sm:place-items-start'
              >
                {day}
              </li>
            ))
          : sv_days.map((day) => (
              <li
                key={day}
                className='week w-full desktop:w-48 py-1 px-0 xs:px-2 sm:pl-2 border-r border-inherit grid place-items-center sm:place-items-start'
              >
                {day}
              </li>
            ))}
      </ul>
      <ul className='w-full desktop:w-fit h-[768px] grid grid-cols-7 grid-rows-[repeat(6,minmax(128px,1fr))] place-items-center overflow-hidden border-l border-b'>
        {previousMonthLastWeek.map((mappedDate) => (
          <DateComponent
            date={mappedDate}
            events={events}
            currentMonth={false}
            onEventClickCallback={(event) => {
              if (onEventClickCallback) {
                onEventClickCallback(event)
              }
            }}
            onDateClickCallback={(date) => {
              setSelectedDate(date)
              if (onDateClickCallback) {
                onDateClickCallback(date)
              }
            }}
            key={mappedDate.toString()}
          />
        ))}
        {[...Array(totalDays)].map((_, index) => {
          const currentDate = setDate(date, index + 1)
          return (
            <DateComponent
              date={currentDate}
              events={events}
              currentMonth
              onEventClickCallback={(event) => {
                if (onEventClickCallback) {
                  onEventClickCallback(event)
                }
              }}
              onDateClickCallback={(date) => {
                if (onDateClickCallback) {
                  onDateClickCallback(date)
                }
              }}
              key={currentDate.toISOString()}
            />
          )
        })}
        {[...Array(MAX_NEXT_MONTH_DAYS)].map((_, index) => (
          <DateComponent
            date={setDate(addMonths(date, 1), index + 1)}
            events={events}
            currentMonth={false}
            onEventClickCallback={(event) => {
              if (onEventClickCallback) {
                onEventClickCallback(event)
              }
            }}
            onDateClickCallback={(date) => {
              if (onDateClickCallback) {
                onDateClickCallback(date)
              }
            }}
            key={index + previousMonthLastWeek.length + totalDays}
          />
        ))}
      </ul>
      {children}
    </div>
  )
}
