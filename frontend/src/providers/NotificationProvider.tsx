import { NotificationContext } from '@/context/NotificationContext'
import type { Notification } from '@/models/Notification'
import { useContext } from 'react'

interface notificationsContextData {
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  setNotifications: (notifications: Notification[]) => void
}

export function useNotifications(): notificationsContextData {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error(
      '`useNotifications` must be used within an `NotificationProvider`, Ensure `NotificationProvider` is in `ClientProviders.tsx` file.'
    )
  }

  const {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    setNotifications,
  } = context

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    setNotifications,
  }
}
