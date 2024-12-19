import type Event from '@/models/items/Event'
import { getDay, isSameDay } from 'date-fns'
import type { JSX } from 'react'
import tinycolor from 'tinycolor2'

interface Props {
  event: Event
  date: Date
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
  onEventClick,
}: Props): JSX.Element {
  const tinyEventColor = tinycolor(event.background_color)
  const defaultColor = tinyEventColor.isDark()
    ? tinyEventColor.darken(10).toString()
    : event.background_color
  const hoverColor = tinyEventColor.isDark()
    ? tinyEventColor.lighten(5).toString()
    : tinyEventColor.darken(5).toString()

  const startDate = new Date(event.start_date)
  const endDate = new Date(startDate.getTime() + event.duration * 60_000)

  const multipleDays = !isSameDay(endDate, date)

  return (
    <li
      className={`${
        getDay(date) === 0 && multipleDays ? 'w-full' : 'w-2 sm:w-full'
      } ${
        isSameDay(startDate, date) && 'z-20'
      }h-4 sm:h-5 rounded-md text-xs overflow-y-hidden flex items-center
        ${
          tinycolor(event.background_color).isDark()
            ? 'text-white'
            : 'text-black'
        }
        ${event.background_color === '#FFFFFF' && 'border dark:border-none'}
        ${isSameDay(new Date(event.start_date), date) && 'sm:h-5'}`}
      onClick={(e) => {
        e.stopPropagation()
        if (onEventClick) onEventClick(event)
      }}
      onKeyDown={(e) => {
        e.stopPropagation()
        if (onEventClick && e.key === 'Enter') onEventClick(event)
      }}
      style={{
        backgroundColor: defaultColor,
      }}
    >
      <div
        className={`${event.event_id} w-full h-full sm:py-0.5 z-20
          ${
            tinycolor(event.background_color).isDark()
              ? 'text-white'
              : 'text-black'
          }`}
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
              `background-color: ${hoverColor} !important;`
            )
          }
        }}
        onMouseOut={(e) => {
          e.stopPropagation()
          const elements = document.getElementsByClassName(event.event_id)
          for (let i = 0; i < elements.length; i++) {
            elements[i].setAttribute(
              'style',
              `background-color: ${defaultColor} !important;`
            )
          }
        }}
      >
        <p
          className={`absolute z-50 px-2 truncate ${
            isSameDay(new Date(event.start_date), date)
              ? !multipleDays && getDay(date) !== 0
                ? 'hidden sm:block' // Single day event
                : 'hidden xxs:block text-nowrap' // First day of multiple day event
              : 'hidden' // Not the first day of multiple day event
          }`}
          style={{
            maxWidth: `calc(95% * ${
              getDay(date) === 0
                ? 1
                : Math.min(
                    (endDate.getTime() - startDate.getTime()) /
                      (1000 * 60 * 60 * 24) +
                      1,
                    8 - getDay(date)
                  )
            })`,
          }}
        >
          {event.translations[0].title}
        </p>
      </div>

      <span
        className={`${event.event_id} ${
          multipleDays && getDay(date) !== 0 ? 'block' : 'hidden'
        } w-[110%] sm:w-20 h-4 sm:h-5 absolute left-3 sm:left-auto sm:-right-10 z-10 rounded-md`}
        style={{
          backgroundColor: defaultColor,
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
              `background-color: ${hoverColor} !important;`
            )
          }
        }}
        onMouseOut={(e) => {
          e.stopPropagation()
          const elements = document.getElementsByClassName(event.event_id)
          for (let i = 0; i < elements.length; i++) {
            elements[i].setAttribute(
              'style',
              `background-color: ${defaultColor} !important;`
            )
          }
        }}
      />
    </li>
  )
}
