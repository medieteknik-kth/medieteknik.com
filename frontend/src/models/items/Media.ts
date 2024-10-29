import { Item } from '@/models/Items'
import { LanguageCode } from '@/models/Language'

export interface Media extends Item {
  media_url: string
  media_type: 'image' | 'video'
  translations: MediaTranslation[]
}

export interface MediaTranslation {
  title: string
  description: string
  language_code: LanguageCode
}
