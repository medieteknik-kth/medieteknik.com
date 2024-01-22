'use client'
import { useEffect, useState } from 'react'
import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import { useCookies } from 'next-client-cookies'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getOptions, supportedLanguages, cookieName } from './settings'
import { CookieConsent, ClientCookieConsent  } from '@/utility/CookieConsent'

const isRunningOnServer = typeof window === 'undefined'

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((lng: string, ns: string) => import(`./locales/${lng}/${ns}.json`)))
  .init({
    ...getOptions(),
    lng: undefined,
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
      caches: [],
    },
    preload: isRunningOnServer ? supportedLanguages : [],
  });

export function useTranslation(language: string, namespace: string, options: {keyPrefix?: string | undefined} = {}) {
  const cookies = useCookies()
  const ret = useTranslationOrg(namespace, options)
  const { i18n } = ret

  if(isRunningOnServer && language && i18n.resolvedLanguage !== language) {
    i18n.changeLanguage(language)
  } else {
    const [activeLanguage, setActiveLanguage] = useState(i18n.resolvedLanguage)

    useEffect(() => {
      if(activeLanguage === language) return;
      setActiveLanguage(language)
    }, [language, i18n.resolvedLanguage]);

    useEffect(() => {
      if(!language || i18n.resolvedLanguage === language) return;
      i18n.changeLanguage(language)
    }, [language, i18n.resolvedLanguage]);

    useEffect(() => {
      const clientCookieConsent = new ClientCookieConsent(window)
      if(clientCookieConsent.isConsentLevelSufficient(CookieConsent.NONE)) return;
      if(cookies.get(cookieName) === language) return;

      cookies.set(cookieName, language, { path: '/' })
      
    }, [language, cookies.get(cookieName)]);
  }

  return ret
}
