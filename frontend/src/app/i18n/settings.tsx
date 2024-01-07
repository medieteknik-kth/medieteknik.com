import {InitOptions} from 'i18next';
export const fallbackLanguage: string = 'sv';
export const supportedLanguages: string[] = [fallbackLanguage, 'en'];
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