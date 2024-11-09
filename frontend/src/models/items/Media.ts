import Item from '@/models/Items'
import { LanguageCode } from '@/models/Language'

type MediaTypes = 'image' | 'video'

/**
 * @interface Media
 * @extends Item
 * @description Describes a media item from the backend and API responses
 *
 * @property {string} media_url - The URL of the media item
 * @property {'image' | 'video'} media_type - The type of the media item (image or video)
 * @property {MediaTranslation[]} translations - The translations of the media item
 */
export default interface Media extends Item {
  media_url: string
  media_type: MediaTypes
  translations: MediaTranslation[]
}

/**
 * @interface MediaTranslation
 * @description Holds the translations of each media item, is at least 1:1 with the Media model and is used to display the media item in different languages
 *
 * @property {string} title - The title of the media item
 * @property {string} description - The description of the media item
 * @property {LanguageCode} language_code - The language code of the media item
 */
export interface MediaTranslation {
  title: string
  description: string
  language_code: LanguageCode
}
