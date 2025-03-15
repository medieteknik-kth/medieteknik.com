import type { Notification } from '@/models/Notification'

interface NotificationState {
  notifications: Notification[]
}

export interface NotificationContextType extends NotificationState {
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  setNotifications: (notifications: Notification[]) => void
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }

export const initialState: NotificationState = {
  notifications: [],
}

export function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.notification_id !== action.payload
        ),
      }
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read: true,
        })),
      }
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload }
    default:
      return state
  }
}
