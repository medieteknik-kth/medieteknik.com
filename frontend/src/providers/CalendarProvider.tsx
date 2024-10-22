'use client'
import { GetEvents } from '@/api/calendar'
import { Event } from '@/models/Items'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type JSX,
} from 'react';

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
        events: state.events.filter((event) => event !== action.payload),
      }
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((event) =>
          event === action.payload ? action.payload : event
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
  setEvents: (events: Event[]) => void
  addEvent: (event: Event) => void
  removeEvent: (event: Event) => void
  updateEvent: (event: Event) => void
  setSelectedDate: (date: Date) => void
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
)

export const revalidate = 60 * 60 * 24

/**
 * Renders the CalendarProvider component with the provided children.
 *
 * @param {React.ReactNode} children - The children of the component.
 * @return {JSX.Element} The CalendarProvider component.
 */
export default function CalendarProvider({
  language,
  children,
}: {
  language: string
  children: React.ReactNode
}): JSX.Element {
  const [state, dispatch] = useReducer(calendarReduction, initalState)

  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    const retrieveEvents = async (date: Date) => {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      try {
        const events = await GetEvents(date, language)

        if (isMounted.current && events) {
          dispatch({ type: 'SET_EVENTS', payload: events })
        }
      } catch (error) {
        console.error('Failed to retrieve events:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to retrieve events' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    retrieveEvents(state.date)
  }, [state.date])

  const contextValue = useMemo(
    () => ({
      ...state,
      /**
       * Sets the date of the calendar by dispatching the action to set it.
       *
       * @param {Date} newDate - The new date to be set.
       * @return {void}
       */
      setDate: (newDate: Date): void => {
        dispatch({ type: 'SET_DATE', payload: newDate })
      },
      /**
       * Sets the events of the calendar by dispatching the action to set them.
       *
       * @param {Event[]} newEvents - The new events to be set.
       * @return {void}
       */
      setEvents: (newEvents: Event[]): void => {
        dispatch({ type: 'SET_EVENTS', payload: newEvents })
      },
      /**
       * Adds an event to the calendar by dispatching the action to add it.
       * Mainly used for optimal rendering client-side. Or adding calendar-specific events.
       *
       * @param {Event} newEvent - The new event to be added.
       * @return {void}
       */
      addEvent: (newEvent: Event): void => {
        dispatch({ type: 'ADD_EVENT', payload: newEvent })
      },
      /**
       * Removes an event from the calendar by dispatching the action to remove it.
       *
       * @param {Event} eventToRemove - The event to be removed.
       * @return {void}
       */
      removeEvent: (eventToRemove: Event): void => {
        dispatch({ type: 'REMOVE_EVENT', payload: eventToRemove })
      },
      /**
       * Updates an event in the calendar by dispatching the action to update it.
       *
       * @param {Event} updatedEvent - The event to be updated.
       * @return {void}
       */
      updateEvent: (updatedEvent: Event): void => {
        dispatch({ type: 'UPDATE_EVENT', payload: updatedEvent })
      },
      /**
       * Sets the selected date of the calendar by dispatching the action to set it.
       *
       * @param {Date} newDate - The new date to be set.
       * @return {void}
       */
      setSelectedDate: (newDate: Date): void => {
        dispatch({ type: 'SET_SELECTED_DATE', payload: newDate })
      },
    }),
    [state]
  )

  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>
  )
}

/**
 * useCalendar
 * @description The hook for the Calendar component.
 *
 * @returns The context for the Calendar component.
 * @throws {Error} If the hook is used outside of the CalendarProvider.
 */
export function useCalendar() {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error('`useCalendar` must be used within a `CalendarProvider`')
  }
  return context
}
