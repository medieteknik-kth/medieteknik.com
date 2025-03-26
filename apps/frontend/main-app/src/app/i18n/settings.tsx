import type { LanguageCode } from '@/models/Language'
import { DEFAULT_NS, FALLBACK_LANGUAGE, SUPPORTED_LANGUAGES } from '@/utility/Constants'
import type { InitOptions } from 'i18next'


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
