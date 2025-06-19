import type { Language, LanguageCode } from '@/models/Language'
import { GB, SE } from 'country-flag-icons/react/3x2'
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

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
export const COOKIE_VERSION_NAME: string = 'cookie_version'
export const COOKIE_VERSION_VALUE: string = '1'

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

export const COOKIE_SETTINGS: Record<string, Partial<ResponseCookie>> = {
  language: {
    path: process.env.NODE_ENV === 'development' ? '/' : '.medieteknik.com',
    sameSite: 'strict',
    expires: new Date(Date.now() + 31_536_000_000), // 1 year
    secure: process.env.NODE_ENV === 'production',
  },
  cookie_version: {
    path: process.env.NODE_ENV === 'development' ? '/' : '.medieteknik.com',
    sameSite: 'strict',
    expires: new Date(Date.now() + 31_536_000_000), // 1 year
    secure: process.env.NODE_ENV === 'production',
  },
}
