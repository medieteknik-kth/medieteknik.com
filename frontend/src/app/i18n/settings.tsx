import {InitOptions} from 'i18next';
export const fallbackLanguage: string = 'en';
export let supportedLanguages: string[] = [fallbackLanguage, 'sv'];
export const cookieName: string = 'language';
export const defaultNS: string = 'translation';


export function getOptions(lng:string = fallbackLanguage, ns:string = defaultNS): InitOptions {
  return {
      supportedLngs: supportedLanguages,
      fallbackLng: fallbackLanguage,
      lng,
      fallbackNS: defaultNS,
      defaultNS,
      ns
  };
}