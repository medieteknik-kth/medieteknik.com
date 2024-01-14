import {InitOptions} from 'i18next';
/*import { getAllLanguages } from '@/api';*/
export const fallbackLanguage: string = 'sv';
export const supportedLanguages: string[] = [fallbackLanguage, 'en'];
export const cookieName: string = 'language';
export const defaultNS: string = 'translation';

/* TODO: Implement this at a later date
export async function getSupportedLanguages(): Promise<string[]> {
  const languages: string[] = await getAllLanguages();

  if (languages) {
    return languages;
  }

  return [fallbackLanguage, 'en'];
}*/

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