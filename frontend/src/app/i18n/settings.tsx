import { LanguageCode } from '@/models/Language'
import { InitOptions } from 'i18next'

export const fallbackLanguage: LanguageCode = 'sv'
export let supportedLanguages: LanguageCode[] = [fallbackLanguage, 'en']
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
