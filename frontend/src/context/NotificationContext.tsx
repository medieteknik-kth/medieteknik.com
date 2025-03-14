import {
  type NotificationContextType,
  initialState,
  notificationReducer,
} from '@/context/notificationReducer'
import type { LanguageCode } from '@/models/Language'
import type { Notification } from '@/models/Notification'
import { useStudent } from '@/providers/AuthenticationProvider'
import { API_BASE_URL, FALLBACK_LANGUAGE } from '@/utility/Constants'
import type { JSX } from 'react'
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined)

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const [state, dispatch] = useReducer(notificationReducer, initialState)
  const { student } = useStudent()

  const retrieveNotifications = useCallback(async (language: LanguageCode) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/students/notifications?language=${language}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }
      const data = (await response.json()) as Notification[]

      dispatch({ type: 'SET_NOTIFICATIONS', payload: data })
    } catch (error) {
      console.error('Error retrieving notifications:', error)
    }
  }, [])

  useEffect(() => {
    const languageCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('language='))
    const language = languageCookie
      ? (languageCookie.split('=')[1] as LanguageCode)
      : FALLBACK_LANGUAGE

    if (student) {
      retrieveNotifications(language)
    } else {
      dispatch({ type: 'SET_NOTIFICATIONS', payload: [] })
    }
  }, [retrieveNotifications, student])

  const contextValue = useMemo(
    () => ({
      notifications: state.notifications,
      addNotification: (notification: Notification) =>
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
      setNotifications: (notifications: Notification[]) =>
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications }),
      removeNotification: (id: string) =>
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
      clearNotifications: () => dispatch({ type: 'CLEAR_NOTIFICATIONS' }),
      retrieveNotifications,
    }),
    [state.notifications, retrieveNotifications]
  )

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  )
}
