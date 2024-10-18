import EventComponent from '@/components/calendar/components/eventDisplay'
import { Event } from '@/models/Items'
import { isSameDay, isSameMonth } from 'date-fns'

interface Props {
  date: Date
  events: Event[]
  currentMonth: boolean
  onEventClickCallback: (e: Event) => void
  onDateClickCallback: (date: Date) => void
}

/**
 * Sorts events based on the start date in ascending order.
 *
 * @param {Event[]} events - The list of events to be sorted.
 * @return {Event[]} The sorted list of events.
 */
const sortEvents = (events: Event[]): Event[] =>
  events.sort(
    (a, b) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  )

/**
 * Filters events based on the provided date.
 *
 * @param {Event[]} events - The list of events to filter.
 * @param {Date} date - The date to filter events for.
 * @return {Event[]} The filtered list of events for the given date.
 */
const filterEventsForDate = (events: Event[], date: Date): Event[] =>
  events.filter((event) => {
    return isSameDay(new Date(event.start_date), date)
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

  return (
    <li
      className={`w-full desktop:w-48 h-32 border-r relative cursor-pointer ${
        currentMonth
          ? 'bg-white dark:bg-[#111] hover:bg-neutral-200/75 dark:hover:bg-neutral-700/75'
          : 'bg-neutral-100 dark:bg-[#222] hover:bg-neutral-300/75 dark:hover:bg-neutral-700/75'
      }`}
      onClick={(event) => {
        event.stopPropagation()
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
      <div
        className={`w-full absolute top-10 left-0 text-black font-bold px-2 max-h-[80px] overflow-y-auto ${
          !currentMonth && 'opacity-50'
        }`}
      >
        <ul className='flex flex-row sm:flex-col flex-wrap gap-1 h-fit'>
          {filterEventsForDate(sortEvents(events), date).map((event, index) => (
            <EventComponent
              key={index}
              event={event}
              onEventClick={onEventClickCallback}
            />
          ))}
        </ul>
      </div>
    </li>
  )
}
