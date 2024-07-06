'use client'
import api from '@/api'
import { GetEvents } from '@/api/calendar'
import { Event } from '@/models/Items'
import { API_BASE_URL } from '@/utility/Constants'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

/**
 * CalendarContext
 *
 * @description The context for the Calendar component.
 * @see https://reactjs.org/docs/context.html
 *
 * @param date - The current date
 * @param setDate - The function to set the date
 * @param events - The list of events
 * @param setEvents - The function to set the events
 * @param addEvent - The function to add an event
 * @param removeEvent - The function to remove an event
 * @param updateEvent - The function to update an event
 * @param selectedDate - The selected date
 * @param setSelectedDate - The function to set the selected date
 */
const CalendarContext = createContext<{
  date: Date
  setDate: (date: Date) => void
  events: Event[]
  retrieveEvents: (date: Date) => void
  setEvents: (events: Event[]) => void
  addEvent: (event: Event) => void
  removeEvent: (event: Event) => void
  updateEvent: (event: Event) => void
  selectedDate: Date
  setSelectedDate: (date: Date) => void
}>({
  date: new Date(),
  setDate: () => {},
  events: [],
  retrieveEvents: () => {},
  setEvents: () => {},
  addEvent: () => {},
  removeEvent: () => {},
  updateEvent: () => {},
  selectedDate: new Date(),
  setSelectedDate: () => {},
})

export default function CalendarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [date, setDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())

  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const addEvent = useCallback(
    (event: Event) => {
      setEvents([...events, event])
    },
    [events]
  )

  const removeEvent = useCallback(
    (event: Event) => {
      setEvents(events.filter((e) => e.url !== event.url))
    },
    [events]
  )

  const updateEvent = useCallback(
    (event: Event) => {
      setEvents(events.map((e) => (e.url === event.url ? event : e)))
    },
    [events]
  )

  const retrieveEvents = useCallback(async (date: Date) => {
    try {
      const events = await GetEvents(date)

      if (isMounted.current && events ) {
        setEvents(events as Event[])
      }
    } catch (error) {
      console.error('Failed to retrieve events:', error)
    }
  }, [])

  useEffect(() => {
    retrieveEvents(date)
  }, [date, retrieveEvents])

  return (
    <CalendarContext.Provider
      value={{
        date,
        setDate,
        events,
        retrieveEvents,
        setEvents,
        addEvent,
        removeEvent,
        updateEvent,
        selectedDate,
        setSelectedDate,
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}

/**
 * useCalendar
 *
 * @description The hook for the Calendar component.
 * @returns The context for the Calendar component.
 */
export function useCalendar() {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error('`useCalendar` must be used within a `CalendarProvider`')
  }
  return context
}
