import { InitOptions } from 'i18next'
import { LanguageCodes } from '@/utility/Constants'

export const fallbackLanguage: LanguageCodes = 'en'
export let supportedLanguages: LanguageCodes[] = [fallbackLanguage, 'sv']
export const cookieName: string = 'language'
export const defaultNS: string = 'translation'

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
