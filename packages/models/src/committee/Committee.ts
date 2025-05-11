import type { LanguageCode } from '../util/Language'

/**
 * @interface Committee
 * @description Committee model
 *
 * @param {string} name - Committee name
 * @param {string} email - Committee email
 * @param {string} logo_url - Committee logo URL (optional)
 */
export interface Committee {
  committee_id: string
  author_type: string
  email: string
  group_photo_url?: string
  logo_url: string
  total_documents: number
  total_events: number
  total_media: number
  total_news: number
  hidden: boolean
  translations: CommitteeTranslation[]
}

export interface CommitteeTranslation {
  title: string
  description: string
  language_code: LanguageCode
}

export interface CommitteeData {
  members: {
    ids: string[]
    total: number
  }
  positions: {
    ids: string[]
    total: number
  }
  news: {
    ids: string[]
    total: number
  }
  events: {
    ids: string[]
    total: number
  }
  documents: {
    ids: string[]
    total: number
  }
  albums: {
    ids: string[]
    total: number
  }
}
