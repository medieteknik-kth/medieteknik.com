'use client'

import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'
import { useEffect, useState } from 'react'
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
  UseTranslationResponse,
} from 'react-i18next'
import { getOptions, supportedLanguages } from './settings'

const isRunningOnServer = typeof window === 'undefined'

// Initialize i18next instance with resources
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (lng: string, ns: string) => import(`./locales/${lng}/${ns}.json`)
    )
  )
  .init({
    ...getOptions(),
    lng: undefined,
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
      caches: [],
    },
    preload: isRunningOnServer ? supportedLanguages : [],
  })

/**
 * @name useTranslation
 * @description Get client-side translations for a language and namespace
 *
 * @param {string} language - The language code to use
 * @param {string} namespace - The namespace, i.e. the translation file name
 * @param {object} options - Additional options
 * @returns {UseTranslationResponse<string, string>} Translation function and i18next instance
 */
export function useTranslation(
  language: string,
  namespace: string,
  options: { keyPrefix?: string | undefined } = {}
): UseTranslationResponse<string, string> {
  const ret = useTranslationOrg(namespace, options)
  const { i18n } = ret
  const [activeLanguage, setActiveLanguage] = useState(i18n.resolvedLanguage)

  // Set the active language
  useEffect(() => {
    if (activeLanguage === language) return
    setActiveLanguage(language)
  }, [language, i18n.resolvedLanguage, activeLanguage])

  // Change the language
  useEffect(() => {
    if (!language || i18n.resolvedLanguage === language) return
    i18n.changeLanguage(language)
  }, [language, i18n.resolvedLanguage, i18n])

  useEffect(() => {
    if (!language) return
    window.localStorage.setItem('language', language)
  }, [language])

  if (isRunningOnServer && language && i18n.resolvedLanguage !== language) {
    i18n.changeLanguage(language)
  }

  return ret
}
