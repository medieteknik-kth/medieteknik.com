import type { LanguageCode } from '@/models/Language'
import type { InitOptions } from 'i18next'

export const FALLBACK_LANGUAGE: LanguageCode = 'en'
export const SUPPORTED_LANGUAGES: LanguageCode[] = [FALLBACK_LANGUAGE, 'sv']
export const LANGUAGE_COOKIE_NAME: string = 'language'
export const DEFAULT_NS: string = 'translation'

/**
 * @name getOptions
 * @description Get i18next options
 *
 * @param {string} lng - The language code to use
 * @param {string} ns - The namespace, i.e. the translation file name
 * @returns {InitOptions} i18next options
 * @see https://www.i18next.com/overview/configuration-options
 */
export function getOptions(
  lng: string = FALLBACK_LANGUAGE,
  ns: string = DEFAULT_NS
): InitOptions {
  return {
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: FALLBACK_LANGUAGE,
    lng,
    fallbackNS: DEFAULT_NS,
    defaultNS: DEFAULT_NS,
    ns,
  }
}
