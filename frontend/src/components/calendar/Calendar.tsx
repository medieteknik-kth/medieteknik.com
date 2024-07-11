import { Event } from '@/models/Items'
import {
  startOfMonth,
  getDay,
  subWeeks,
  startOfWeek,
  addDays,
  getDaysInMonth,
  setDate,
  addMonths,
  isSameMonth,
  isSameDay,
  subMonths,
} from 'date-fns'
import { useCalendar } from './CalendarProvider'
import './calendar.css'

/**
 * Returns an array of dates representing the last week of the previous month adjusted to include only dates that are before the start of the current month.
 *
 * @param {Date} currentDate - The current date.
 * @return {Date[]} An array of dates representing the last week of the previous month adjusted to include only dates that are before the start of the current month.
 */
function getPreviousMonthsLastWeekAdjusted(currentDate: Date) {
  const startOfCurrentMonth = startOfMonth(currentDate)

  const lastWeekOfPreviousMonthEnd = subWeeks(startOfCurrentMonth, 0)
  const lastWeekOfPreviousMonthStart = startOfWeek(lastWeekOfPreviousMonthEnd)

  let lastWeekAdjusted = []
  for (let i = 1; i <= 5; i++) {
    const date = addDays(lastWeekOfPreviousMonthStart, i)
    if (date < startOfCurrentMonth) {
      lastWeekAdjusted.push(date)
    }
  }
  return lastWeekAdjusted
}

function displayEvents(
  events: Event[],
  date: Date,
  onEventClickCallback: (e: Event) => void
) {
  const tinycolor = require('tinycolor2')
  return (
    <div className='flex flex-col gap-1'>
      {events.length >= 1 &&
        events
          .sort(
            (a, b) =>
              new Date(a.start_date).getTime() -
              new Date(b.start_date).getTime()
          )
          .map(
            (event) =>
              isSameMonth(new Date(event.start_date), date) &&
              isSameDay(new Date(event.start_date), date) && (
                <div
                  key={event.url}
                  className='w-2 h-4 sm:w-full sm:h-fit px-2 py-0.5 z-10 rounded-2xl text-xs max-h-6 overflow-hidden'
                  style={{
                    backgroundColor: event.background_color,
                    color: tinycolor(event.background_color).isDark()
                      ? 'white'
                      : 'black',
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation()
                    // Hover effect
                    const bg = tinycolor(event.background_color)
                    e.currentTarget.style.backgroundColor = bg.isDark()
                      ? bg.darken(10).toString()
                      : bg.lighten(10).toString()
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation()
                    e.currentTarget.style.backgroundColor =
                      event.background_color
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onEventClickCallback(event)
                  }}
                >
                  <p className='truncate hidden sm:block'>
                    {event.translations[0].title}
                  </p>
                </div>
              )
          )}
    </div>
  )
}

export default function Calendar({
  onDateClickCallback = () => {},
  onEventClickCallback = () => {},
  children,
}: {
  onDateClickCallback?: (date: Date) => void
  onEventClickCallback?: (event: Event) => void
  children?: React.ReactNode
}) {
  const { date, selectedDate, setSelectedDate, retrieveEvents, events } =
    useCalendar()
  const totalDays = getDaysInMonth(new Date(date))

  if (events.length === 0) {
    retrieveEvents(date)
  }

  return (
    <div
      id='calendar'
      className='w-full desktop:w-fit h-fit min-h-[750px] relative'
    >
      <div className='w-full desktop:w-fit grid grid-cols-7 grid-rows-1 font-bold text-lg border-l border-t rounded-t'>
        <p className='week w-full desktop:w-48 py-4 px-0 xs:px-2 sm:pl-2 border-r border-inherit grid place-items-center sm:place-items-start'>
          MON
        </p>
        <p className='week w-full desktop:w-48 py-4 px-0 xs:px-2 sm:pl-2 border-r border-inherit grid place-items-center sm:place-items-start'>
          TUE
        </p>
        <p className='week w-full desktop:w-48 py-4 px-0 xs:px-2 sm:pl-2 border-r border-inherit grid place-items-center sm:place-items-start'>
          WED
        </p>
        <p className='week w-full desktop:w-48 py-4 px-0 xs:px-2 sm:pl-2 border-r border-inherit grid place-items-center sm:place-items-start'>
          THU
        </p>
        <p className='week w-full desktop:w-48 py-4 px-0 xs:px-2 sm:pl-2 border-r border-inherit grid place-items-center sm:place-items-start'>
          FRI
        </p>
        <p className='week w-full desktop:w-48 py-4 px-0 xs:px-2 sm:pl-2 border-r border-inherit grid place-items-center sm:place-items-start'>
          SAT
        </p>
        <p className='week w-full desktop:w-48 py-4 px-0 xs:px-2 sm:pl-2 border-r border-inherit rounded-tr grid place-items-center sm:place-items-start'>
          SUN
        </p>
      </div>
      <div className='w-full desktop:w-fit h-[864px] grid grid-cols-7 grid-rows-[repeat(6,minmax(144px,1fr))] place-items-center overflow-hidden border-l border-b'>
        {getPreviousMonthsLastWeekAdjusted(date).map((mappedDate, index) => (
          <div
            key={index}
            className='w-full desktop:w-48 h-36 border-r relative bg-neutral-200/75'
            onClick={(event) => {
              event.stopPropagation()
              setSelectedDate(mappedDate)
              onDateClickCallback(mappedDate)
            }}
          >
            <p className='absolute top-2 left-2 text-md sm:text-2xl text-neutral-400 select-none'>
              {mappedDate.getDate()}
            </p>
            <div className='w-full absolute top-10 left-0 text-black font-bold px-2 max-h-[92px] overflow-y-auto opacity-50'>
              {displayEvents(
                events,
                subMonths(new Date(date), 1),
                onEventClickCallback
              )}
            </div>
          </div>
        ))}
        {[...Array(totalDays)].map((_, index) => (
          <div
            key={index}
            className={`w-full desktop:w-48 h-36 border-r border-t relative bg-white dark:bg-[#111] ${
              new Date().getDate() === index + 1 &&
              isSameMonth(new Date(), date)
                ? 'text-red-400'
                : 'text-neutral-400'
            }
            `}
          >
            <p
              className={`absolute top-2 left-2 text-md sm:text-2xl select-none z-20`}
            >
              {index + 1}
            </p>
            <div className='w-full h-full'>
              <div
                className={`absolute w-full h-full top-0 left-0 cursor-pointer hover:bg-neutral-200/50 z-10 ${
                  selectedDate.getDate() === index + 1 &&
                  isSameMonth(selectedDate, date)
                    ? 'bg-red-100/50 hover:bg-red-100'
                    : ''
                } `}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedDate(new Date(setDate(date, index + 1)))
                  onDateClickCallback(new Date(setDate(date, index + 1)))
                }}
              />
              <div className='w-full absolute top-10 left-0 text-black font-bold px-2 max-h-[92px] overflow-y-auto'>
                {displayEvents(
                  events,
                  setDate(new Date(date), index + 1),
                  onEventClickCallback
                )}
              </div>
            </div>
          </div>
        ))}
        {[...Array(14)].map((_, index) => (
          <div
            key={index}
            className='w-full desktop:w-48 h-36 border-r border-t relative bg-neutral-200/75 dark:bg-neutral-700/75 cursor-pointer hover:bg-neutral-300/75'
            onClick={(event) => {
              event.stopPropagation()
              const dateClicked = addMonths(date, 1)
              setSelectedDate(setDate(dateClicked, index + 1))
              onDateClickCallback(setDate(dateClicked, index + 1))
            }}
          >
            <p className='absolute top-2 left-2 text-md sm:text-2xl text-neutral-400 select-none'>
              {index + 1}
            </p>
            <div className='w-full absolute top-10 left-0 text-black font-bold px-2 max-h-[92px] overflow-y-auto'>
              {displayEvents(
                events,
                addMonths(new Date(date), 1),
                onEventClickCallback
              )}
            </div>
          </div>
        ))}
      </div>
      {children}
    </div>
  )
}
