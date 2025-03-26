import { getPreviousMonthLastWeekToCurrent } from '@/components/calendar/util'
import type Event from '@/models/items/Event'
import {
  addMonths,
  differenceInDays,
  getDay,
  isSameDay,
  isSameMonth,
  startOfDay,
} from 'date-fns'
import { type JSX, useMemo } from 'react'
import tinycolor from 'tinycolor2'

interface Props {
  event: Event
  date: Date
  index: number
  onEventClick?: (event: Event) => void
}

/**
 * @name EventComponent
 * @description This component is used to display an event in the calendar.
 *
 * @param {Props} props
 * @param {Event} props.event - The event to display.
 * @param {(event: Event) => void} props.onEventClick - The callback function when the event is clicked.
 *
 * @returns {JSX.Element} The event component.
 */
export default function EventComponent({
  event,
  date,
  index,
  onEventClick,
}: Props): JSX.Element {
  const tinyEventColor = tinycolor(event.background_color)
  const defaultColor = tinyEventColor.isDark()
    ? tinyEventColor.darken(10).toHex()
    : tinyEventColor.toHex()
  const hoverColor = tinyEventColor.isDark()
    ? tinyEventColor.lighten(5).toHex()
    : tinyEventColor.darken(5).toHex()

  const startDate = new Date(event.start_date)
  const endDate = new Date(startDate.getTime() + event.duration * 60_000)
  const spanDays = differenceInDays(startOfDay(endDate), startOfDay(startDate))
  const multipleDays = !isSameDay(endDate, date)
  const isLongMultiDayEvent = spanDays > 3
  const previousMonthLastWeek = useMemo(
    () => getPreviousMonthLastWeekToCurrent(addMonths(date, 1)),
    [date]
  )

  return (
    <li
      className={`${getDay(date) === 0 && multipleDays ? 'w-full' : 'w-full'} ${
        isSameDay(startDate, date) ? 'z-20 ' : 'z-10 '
      }h-4 sm:h-5 text-xs overflow-y-hidden flex items-center rounded-lg 
        ${
          tinycolor(event.background_color).isDark()
            ? 'text-white'
            : 'text-black'
        } ${event.background_color === '#FFFFFF' ? 'border dark:border-none' : ''} ${isSameDay(new Date(event.start_date), date) ? 'sm:h-5' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        if (onEventClick) onEventClick(event)
      }}
      onKeyDown={(e) => {
        e.stopPropagation()
        if (onEventClick && e.key === 'Enter') onEventClick(event)
      }}
    >
      <div
        className={`hidden absolute left-2 bg-black/20 dark:bg-black/40 h-4 sm:h-5 z-30 ${!isSameDay(startDate, date) ? 'hidden' : ''} ${isSameMonth(startDate, new Date()) ? 'hidden' : ''}`}
        style={{
          top: `${(index + 1) * 4 + 36}px`,
          // Calculate how many days the event spans over
          right: `${8 - (multipleDays ? spanDays * 175 + 17 * spanDays : 0)}px`,
        }}
      />
      <div
        className={`${event.event_id} w-full h-full sm:py-0.5 ${multipleDays && !isSameDay(startDate, date) && !isSameDay(previousMonthLastWeek[0], date) ? 'z-0' : 'z-10'}
          ${
            tinycolor(event.background_color).isDark()
              ? 'text-white'
              : 'text-black'
          }`}
        style={{
          backgroundColor: `#${defaultColor}`,
        }}
        onFocus={(e) => {
          e.stopPropagation()
          const elements = document.getElementsByClassName(event.event_id)
          for (let i = 0; i < elements.length; i++) {
            elements[i].setAttribute(
              'style',
              'border: 1px solid black !important;'
            )
          }
        }}
        onBlur={(e) => {
          e.stopPropagation()
          const elements = document.getElementsByClassName(event.event_id)
          for (let i = 0; i < elements.length; i++) {
            elements[i].setAttribute('style', 'border: 0')
          }
        }}
        onMouseOver={(e) => {
          e.stopPropagation()
          const elements = document.getElementsByClassName(event.event_id)

          for (let i = 0; i < elements.length; i++) {
            elements[i].setAttribute(
              'style',
              `background-color: #${hoverColor} !important;`
            )
          }
        }}
        onMouseOut={(e) => {
          e.stopPropagation()
          const elements = document.getElementsByClassName(event.event_id)
          for (let i = 0; i < elements.length; i++) {
            elements[i].setAttribute(
              'style',
              `background-color: #${defaultColor} !important;`
            )
          }
        }}
      >
        <p
          className={`absolute z-50 px-2 truncate filter ${
            isSameDay(new Date(event.start_date), date)
              ? isLongMultiDayEvent
                ? 'long block text-nowrap' // Always show title for long multi-day events
                : !multipleDays && getDay(date) !== 0
                  ? 'single hidden sm:block' // Single day event
                  : 'first-long hidden xxs:block text-nowrap' // First day of multiple day event
              : isSameDay(previousMonthLastWeek[0], date)
                ? 'xs:block hidden text-nowrap'
                : isLongMultiDayEvent &&
                    differenceInDays(
                      startOfDay(date),
                      startOfDay(startDate)
                    ) === 1
                  ? 'multi block sm:hidden text-nowrap' // Show title on second day of long multi-day event
                  : 'fallback hidden' // Hide title for other days of long multi-day event
          }`}
          style={{
            maxWidth: `${
              multipleDays
                ? `calc(95% * ${Math.min(spanDays, getDay(date) === 0 ? 1 : 7 - getDay(date))})`
                : '95%'
            }`,
            fontSize: isLongMultiDayEvent ? 'calc(0.65rem + 0.1vw)' : 'inherit',
          }}
        >
          {event.translations[0].title}
        </p>
      </div>

      <span
        className={`${event.event_id} ${
          multipleDays && getDay(date) !== 0 ? 'block' : 'hidden'
        } w-[110%] sm:w-20 h-4 sm:h-5 absolute left-3 sm:left-auto sm:-right-10`}
        style={{
          backgroundColor: `#${defaultColor}`,
        }}
        onFocus={(e) => {
          e.stopPropagation()
          const elements = document.getElementsByClassName(event.event_id)
          for (let i = 0; i < elements.length; i++) {
            elements[i].setAttribute(
              'style',
              'border: 1px solid black !important;'
            )
          }
        }}
        onBlur={(e) => {
          e.stopPropagation()
          const elements = document.getElementsByClassName(event.event_id)
          for (let i = 0; i < elements.length; i++) {
            elements[i].setAttribute('style', 'border: 0')
          }
        }}
        onMouseOver={(e) => {
          e.stopPropagation()
          const elements = document.getElementsByClassName(event.event_id)

          for (let i = 0; i < elements.length; i++) {
            elements[i].setAttribute(
              'style',
              `background-color: #${hoverColor} !important;`
            )
          }
        }}
        onMouseOut={(e) => {
          e.stopPropagation()
          const elements = document.getElementsByClassName(event.event_id)
          for (let i = 0; i < elements.length; i++) {
            elements[i].setAttribute(
              'style',
              `background-color: #${defaultColor} !important;`
            )
          }
        }}
      />
    </li>
  )
}
