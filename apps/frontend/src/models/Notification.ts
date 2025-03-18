import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'

const notificationTypes = ['announcement', 'update', 'news', 'event'] as const

export type NotificationType = (typeof notificationTypes)[number]

/**
 * Interface for structured notification metadata
 */
export interface NotificationMetadata {
  event_start_date?: string
  event_end_date?: string
  event_location?: string
  news_source?: string
  update_version?: string
}

/**
 * @interface Notification
 * @description Notification model
 *
 * @property {string} id      - The notification ID
 * @property {string} title   - The notification title
 * @property {Date} createdAt - The notification date
 * @property {string} body    - The notification description
 * @property {Author} author  - The notification author (optional)
 * @property {boolean} read   - The notification read status (optional)
 * @property {string} image   - The notification image (optional)
 * @property {string} link    - The notification link (optional)
 */
export interface Notification {
  notification_id: string
  notification_type: NotificationType
  committee?: Committee // System notification if undefined
  created_at: string
  metadata?: NotificationMetadata
  translations: NotificationTranslation[]
}

export interface NotificationTranslation {
  title: string
  body: string
  url?: string
  language_code?: LanguageCode
}
