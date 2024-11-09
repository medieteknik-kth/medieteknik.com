import Item from '@/models/Items'
import { LanguageCode } from '@/models/Language'

/**
 * @interface Event
 * @extends Item
 * @description Describes an event from the backend and API responses
 *
 * @property {string} location - The location of the event
 * @property {string} start_date - The start date of the event
 * @property {string} end_date - The end date of the event
 * @property {number} duration - The duration of the event
 * @property {string} background_color - The background color of the event
 * @property {EventTranslation[]} translations - The translations of the event
 */
export default interface Event extends Item {
  event_id: string
  location: string
  start_date: string
  duration: number
  background_color: string
  translations: EventTranslation[]
}

/**
 * @interface EventTranslation
 * @description Holds the translations of each event, is at least 1:1 with the Event model and is used to display the event in different languages
 *
 * @property {string} title - The title of the event
 * @property {string} description - The description of the event (optional)
 * @property {string} main_image_url - The main image URL of the event (optional)
 * @property {string[]} sub_image_urls - The sub image URLs of the event (optional)
 * @property {LanguageCode} language_code - The language code of the event
 */
export interface EventTranslation {
  title: string
  description?: string
  main_image_url?: string
  sub_image_urls?: string[]
  language_code: LanguageCode
}
