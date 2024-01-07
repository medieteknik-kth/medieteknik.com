import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { getOptions } from './settings';

const initI18n = async (language: string, namespace: string) => {
  const i18n = createInstance();
  const options = getOptions(language, namespace);
  await i18n
    .use(initReactI18next)
    .use(resourcesToBackend((lng: string, ns: string) => import(`./locales/${lng}/${ns}.json`)))
    .init(options);
  return i18n;
}

export async function useTranslation(language: string, namespace: string, options: {keyPrefix?: string | undefined} = {}) {
  const i18n = await initI18n(language, namespace);
  return {
    t: i18n.getFixedT(language, Array.isArray(namespace) ? namespace[0] : namespace, options.keyPrefix),
    i18n: i18n,
  }
}