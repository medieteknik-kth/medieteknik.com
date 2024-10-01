import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { getOptions } from './settings'
import { I18n, TFunction } from 'next-i18next'

/**
 * @name initI18n
 * @description Initialize i18next instance with resources
 *
 * @param {string} language - The language code to use
 * @param {string} namespace - The namespace, i.e. the translation file name
 * @returns {Promise<I18n>} i18next instance
 */
const initI18n = async (language: string, namespace: string): Promise<I18n> => {
  const i18n = createInstance()
  const options = getOptions(language, namespace)

  await i18n
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (lng: string, ns: string) => import(`./locales/${lng}/${ns}.json`)
      )
    )
    .init(options)
  return i18n
}

/**
 * @name useTranslation
 * @description Get server-side translations for a language and namespace
 *
 * @param {string} language - The language code to use
 * @param {string} namespace - The namespace, i.e. the translation file name
 * @param {object} options - Additional options
 * @returns {Promise<{ t: TFunction, i18n: I18n }>} Translation function and i18next instance
 */
export async function useTranslation(
  language: string,
  namespace: string,
  options: { keyPrefix?: string | undefined } = {}
): Promise<{ t: TFunction; i18n: I18n }> {
  const i18n = await initI18n(language, namespace)
  return {
    t: i18n.getFixedT(
      language,
      Array.isArray(namespace) ? namespace[0] : namespace,
      options.keyPrefix
    ),
    i18n: i18n,
  }
}
