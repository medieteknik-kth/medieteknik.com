import { LanguageCode } from '@/models/Language'
import { InitOptions } from 'i18next'

export const fallbackLanguage: LanguageCode = 'en'
export let supportedLanguages: LanguageCode[] = [fallbackLanguage, 'sv']
export const cookieName: string = 'language'
export const defaultNS: string = 'translation'

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
  lng: string = fallbackLanguage,
  ns: string = defaultNS
): InitOptions {
  return {
    supportedLngs: supportedLanguages,
    fallbackLng: fallbackLanguage,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  }
}
