import Item from '@/models/Items'
import { LanguageCode } from '@/models/Language'

/**
 * @interface News
 * @extends Item
 * @description Describes a news item from the backend and API responses
 *
 * @property {string} url - The URL of the news item
 * @property {NewsTranslation[]} translations - The translations of the news item
 */
export default interface News extends Item {
  url: string
  translations: NewsTranslation[]
}

/**
 * @interface NewsTranslation
 * @description Holds the translations of each news item, is at least 1:1 with the News model and is used to display the news item in different languages
 *
 * @property {string} title - The title of the news item
 * @property {string} body - The body of the news item
 * @property {LanguageCode} language_code - The language code of the news item
 * @property {string} main_image_url - The main image URL of the news item
 * @property {string} short_description - The short description of the news item
 * @property {string[]} sub_image_urls - The sub image URLs of the news item (optional)
 */
export interface NewsTranslation {
  title: string
  body: string
  language_code: LanguageCode
  main_image_url: string
  short_description: string
  sub_image_urls?: string[]
}
