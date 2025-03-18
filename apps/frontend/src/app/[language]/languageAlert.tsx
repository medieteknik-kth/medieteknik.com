'use client'

import { useTranslation } from '@/app/i18n/client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { LanguageCode } from '@/models/Language'
import {
  LANGUAGES,
  LANGUAGE_COOKIE_NAME,
  SUPPORTED_LANGUAGES,
} from '@/utility/Constants'
import { LOCAL_STORAGE_LANGUAGE } from '@/utility/LocalStorage'
import { usePathname, useRouter } from 'next/navigation'
import { type JSX, useCallback, useEffect, useState } from 'react'

interface Props {
  language: LanguageCode
}

export default function LanguageAlert({ language }: Props): JSX.Element {
  const path = usePathname()
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [previousLanguage, setPreviousLanguage] = useState(language)

  useEffect(() => {
    const cookies = document.cookie
    const languageCookie = cookies
      .split(';')
      .find((cookie) => cookie.includes(LANGUAGE_COOKIE_NAME))

    if (!languageCookie) {
      return
    }

    if (!languageCookie.includes(language)) {
      const newLanguage = languageCookie.split('=')[1]
      if (!SUPPORTED_LANGUAGES.includes(newLanguage as LanguageCode)) {
        return
      }

      setPreviousLanguage(newLanguage as LanguageCode)
      setVisible(true)
    }
  }, [language])

  const changeLanguage = useCallback(
    (newLanguage: string) => {
      const newPath = path.replace(/^\/[a-z]{2}/, `/${newLanguage}`)
      document.cookie = `${LANGUAGE_COOKIE_NAME}=${newLanguage}; path=/; expires=${new Date(Date.now() + 31_536_000_000)}; SameSite=Lax; ${process.env.NODE_ENV === 'production' ? 'Secure' : ''}`
      window.localStorage.setItem(LOCAL_STORAGE_LANGUAGE, newLanguage)
      router.push(newPath)
    },
    [path, router]
  )

  const { t } = useTranslation(language, 'common')

  if (!visible || previousLanguage === language) {
    return <></>
  }

  return (
    <AlertDialog open={visible}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('different_language.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('different_language.currently_viewing')}
            <span className='font-bold'>{LANGUAGES[language].name}</span>?{' '}
            {t('different_language.switch_question')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setVisible(false)}>
            {t('different_language.remain')}&nbsp;
            <span className='font-bold'>{LANGUAGES[language].name}</span>
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              changeLanguage(previousLanguage)
            }}
          >
            {t('different_language.switch')}&nbsp;
            <span className='font-bold'>
              {LANGUAGES[previousLanguage].name}
            </span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
