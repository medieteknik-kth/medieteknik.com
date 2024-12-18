'use client'

import { useTranslation } from '@/app/i18n/client'
import { supportedLanguages } from '@/app/i18n/settings'
import DetailedCookiePopup from '@/components/cookie/DetailedCookie'
import { Button } from '@/components/ui/button'
import { LanguageCode } from '@/models/Language'
import { LANGUAGES } from '@/utility/Constants'
import { LOCAL_STORAGE_LANGUAGE } from '@/utility/LocalStorage'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useTheme } from 'next-themes'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { JSX, useState } from 'react'

interface Props {
  language: LanguageCode
}

/**
 * @name PreferencesPage
 * @description The component that renders the preferences page, allowing the user to change their language, theme and privacy settings
 *
 * @param {Props} props
 * @param {string} props.language - The language of the preferences page
 *
 * @returns {JSX.Element} The preferences page
 */
export default function PreferencesPage({ language }: Props): JSX.Element {
  const router = useRouter()
  const params = useSearchParams()
  const path = usePathname()
  const [cookiesShown, setCookiesShown] = useState(false)
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation(language, 'preferences')

  const switchLanguage = async (newLanguage: string) => {
    const newPath = path.replace(/^\/[a-z]{2}/, `/${newLanguage}`)
    const category = params.get('category') || 'account'
    window.localStorage.setItem(LOCAL_STORAGE_LANGUAGE, newLanguage)
    router.replace(newPath + '?' + new URLSearchParams({ category }))
  }

  return (
    <section className='grow min-h-[1080px] h-full bg-white dark:bg-[#111] text-black dark:text-white'>
      <div className='w-full flex items-center justify-center border-b-2 border-yellow-400'>
        <h1 className='text-2xl py-4'>{t('title')}</h1>
      </div>
      <div className='w-full h-full flex flex-col gap-4 mt-10 px-10'>
        <section className='w-fit flex items-center flex-col justify-between '>
          <div>
            <h2 className='text-2xl font-bold mb-2'>{t('language')}</h2>
            <div>
              <ul className='flex flex-col xs:flex-row'>
                {supportedLanguages.map((lang) => (
                  <li key={lang} className='w-32 xs:mr-4 first:mb-2 xs:mb-0'>
                    <Button
                      title='Switch Language'
                      onClick={() => {
                        switchLanguage(lang)
                      }}
                      className='w-full'
                      disabled={lang === language}
                      variant={lang === language ? 'default' : 'secondary'}
                    >
                      <span className='w-5 h-5 mr-1'>
                        {LANGUAGES[lang as LanguageCode].flag_icon}
                      </span>
                      <p>{LANGUAGES[lang as LanguageCode].name}</p>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className='w-fit flex items-center flex-col justify-between'>
          <div>
            <h2 className='text-2xl font-bold mb-2'>{t('privacy')}</h2>
            <div>
              <Button
                title={t('cookie_settings')}
                onClick={() => setCookiesShown(true)}
                variant='secondary'
              >
                {t('cookie_settings')}
              </Button>
            </div>
          </div>
        </section>

        <section className='w-fit flex items-center flex-col justify-between'>
          <div>
            <h2 className='text-2xl font-bold mb-2 flex items-center'>
              {t('theme')}
              <sup className='ml-1 text-xs text-red-600 select-none uppercase'>
                Beta
              </sup>
            </h2>

            <div className='h-fit flex flex-col xs:flex-row'>
              <Button
                title='Change to light theme'
                onClick={() => setTheme('light')}
                disabled={theme === 'light'}
                variant={theme === 'light' ? 'default' : 'secondary'}
              >
                <SunIcon className='w-6 h-6 mr-2' />
                {t('light_theme')}
              </Button>

              <Button
                title='Change to dark theme'
                onClick={() => setTheme('dark')}
                disabled={theme === 'dark'}
                className='mt-4 xs:ml-2 xs:mt-0'
                variant={theme === 'dark' ? 'default' : 'secondary'}
              >
                <MoonIcon className='w-6 h-6 mr-2' />
                {t('dark_theme')}
              </Button>
            </div>
          </div>
        </section>
      </div>

      {cookiesShown && (
        <div className='w-full h-screen fixed grid place-items-center left-0 top-0 bg-black/30 z-50'>
          <DetailedCookiePopup language={language} popup={setCookiesShown} />
        </div>
      )}
    </section>
  )
}
