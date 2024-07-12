'use client'
import { GetEvents } from '@/api/calendar'
import { Event } from '@/models/Items'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'


interface CalendarState {
  date: Date
  events: Event[]
  selectedDate: Date
  isLoading: boolean
  error: string | null
}

type CalendarAction =
  | { type: 'SET_DATE'; payload: Date }
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'REMOVE_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'SET_SELECTED_DATE'; payload: Date }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

/**
 * Reducer function for handling calendar state changes based on the given action type.
 *
 * @param {CalendarState} state - The current state of the calendar.
 * @param {CalendarAction} action - The action to be performed on the calendar state.
 * @return {CalendarState} The updated calendar state after applying the action.
 */
function calendarReduction(
  state: CalendarState,
  action: CalendarAction
): CalendarState {
  switch (action.type) {
    case 'SET_DATE':
      return { ...state, date: action.payload }

    case 'SET_EVENTS':
      return { ...state, events: action.payload }

    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] }

    case 'REMOVE_EVENT':
      return {
        ...state,
        events: state.events.filter(
          (event) => event.url !== action.payload.url
        ),
      }
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((event) =>
          event.url === action.payload.url ? action.payload : event
        ),
      }

    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload }

    default:
      return state
  }
}

const initalState: CalendarState = {
  date: new Date(),
  events: [],
  selectedDate: new Date(),
  isLoading: false,
  error: null,
}

interface CalendarContextType extends CalendarState {
  setDate: (date: Date) => void
  retrieveEvents: (date: Date) => void
  setEvents: (events: Event[]) => void
  addEvent: (event: Event) => void
  removeEvent: (event: Event) => void
  updateEvent: (event: Event) => void
  setSelectedDate: (date: Date) => void
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
)

export default function CalendarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, dispatch] = useReducer(calendarReduction, initalState)

  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const retrieveEvents = useCallback(async (date: Date) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    try {
      const events = await GetEvents(date)

      if (isMounted.current && events) {
        dispatch({ type: 'SET_EVENTS', payload: events })
      }
    } catch (error) {
      console.error('Failed to retrieve events:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to retrieve events' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  useEffect(() => {
    retrieveEvents(state.date)
  }, [state.date, retrieveEvents])

  const contextValue = useMemo(
    () => ({
      ...state,
      setDate: (newDate: Date) => {
        dispatch({ type: 'SET_DATE', payload: newDate })
      },
      retrieveEvents,
      setEvents: (newEvents: Event[]) => {
        dispatch({ type: 'SET_EVENTS', payload: newEvents })
      },
      addEvent: (newEvent: Event) => {
        dispatch({ type: 'ADD_EVENT', payload: newEvent })
      },
      removeEvent: (eventToRemove: Event) => {
        dispatch({ type: 'REMOVE_EVENT', payload: eventToRemove })
      },
      updateEvent: (updatedEvent: Event) => {
        dispatch({ type: 'UPDATE_EVENT', payload: updatedEvent })
      },
      setSelectedDate: (newDate: Date) => {
        dispatch({ type: 'SET_SELECTED_DATE', payload: newDate })
      },
    }),
    [state, retrieveEvents]
  )

  return (
    <CalendarContext.Provider value={contextValue}>
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
