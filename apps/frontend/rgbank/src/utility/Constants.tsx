import type { LanguageCode } from '@/models/Language'
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export const FALLBACK_LANGUAGE: LanguageCode = 'en'
export const SUPPORTED_LANGUAGES: LanguageCode[] = [FALLBACK_LANGUAGE, 'sv']

export const LANGUAGE_COOKIE_NAME: string = 'language'
export const COOKIE_VERSION_NAME: string = 'cookie_version'
export const COOKIE_VERSION_VALUE: string = '1'

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
