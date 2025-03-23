import type { Language, LanguageCode } from '@/models/Language'
import { GB, SE } from 'country-flag-icons/react/3x2'

export const SITE_VERSION = '0.6.2'
export const IS_DEVELOPMENT: boolean = process.env.NODE_ENV === 'development'
export const FALLBACK_LANGUAGE: LanguageCode = 'en'
export const SUPPORTED_LANGUAGES: LanguageCode[] = [FALLBACK_LANGUAGE, 'sv']

export const INDEXEDDB_NAME: string = 'SearchDatabase'
export const INDEXEDDB_STORE_NAME: string = 'SearchData'
export const INDEXEDDB_VERSION: number = 1

export const LOCAL_STORAGE_NOTIFICATION_KEY: string = 'notification'
export const LOCAL_STORAGE_READ_NOTIFICATIONS_KEY: string = 'read-notifications'

export const LANGUAGE_COOKIE_NAME: string = 'language'
export const DEFAULT_NS: string = 'translation'
export const LANGUAGES: Language = {
  sv: {
    short_name: 'sv',
    name: 'Svenska',
    flag_icon: (
      <SE
        style={{
          width: 'inherit',
          height: 'inherit',
        }}
      />
    ),
  },
  en: {
    short_name: 'en',
    name: 'English',
    flag_icon: (
      <GB
        style={{
          width: 'inherit',
          height: 'inherit',
        }}
      />
    ),
  },
}
