'use client'

import { useTranslation } from '@/app/i18n/client'
import DetailedCookiePopup from '@/components/cookie/DetailedCookie'
import { changeLanguage } from '@/components/server/changeLanguage'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { LanguageCode } from '@/models/Language'
import { LANGUAGES, SUPPORTED_LANGUAGES } from '@/utility/Constants'
import { useTheme } from 'next-themes'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type JSX, useState } from 'react'

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

  return (
    <section className='w-full h-fit max-w-[1100px] mb-8 2xl:mb-0'>
      <div className='-full mb-4 px-4 pt-4'>
        <h2 className='text-lg font-bold'>{t('title')}</h2>
        <p className='text-sm text-muted-foreground'>{t('description')}</p>
        <Separator className='bg-yellow-400 mt-4' />
      </div>
      <div className='w-full h-fit flex flex-col gap-8 px-4'>
        <section className='w-fit flex items-center flex-col justify-between '>
          <div>
            <div>
              <h3 className='text-sm font-semibold'>{t('language')}</h3>
              <p className='text-xs text-muted-foreground'>
                {t('language_description')}
              </p>
            </div>
            <ul className='flex flex-col xs:flex-row mt-1 gap-2'>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <li key={lang} className='w-32'>
                  <Button
                    title='Switch Language'
                    onClick={() => {
                      changeLanguage(
                        lang,
                        `${path}?category=${params.get('category')}`
                      )
                    }}
                    className='w-full flex gap-1'
                    disabled={lang === language}
                    variant={lang === language ? 'default' : 'secondary'}
                  >
                    <span className='w-5 h-5'>
                      {LANGUAGES[lang as LanguageCode].flag_icon}
                    </span>
                    <p>{LANGUAGES[lang as LanguageCode].name}</p>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className='w-fit flex items-center flex-col justify-between'>
          <div>
            <div>
              <h3 className='text-sm font-semibold'>{t('privacy')}</h3>
              <p className='text-xs text-muted-foreground'>
                {t('privacy_description')}
              </p>
            </div>
            <div className='mt-1'>
              <Button
                title={t('cookie_settings')}
                onClick={() => {
                  const accountElement = document.getElementById('account')
                  if (accountElement) {
                    accountElement.style.zIndex = '100'
                  }
                  setCookiesShown(true)
                }}
                variant='secondary'
              >
                {t('cookie_settings')}
              </Button>
            </div>
          </div>
        </section>

        <section className='w-full flex flex-col justify-between'>
          <div>
            <h3 className='text-sm font-semibold'>
              {t('theme')}
              <sup className='ml-0.5 text-xs text-red-600 select-none uppercase'>
                Beta
              </sup>
            </h3>
            <p className='text-xs text-muted-foreground'>
              {t('theme_description')}
            </p>
          </div>

          <div className='h-fit flex flex-col md:flex-row gap-2 mt-1'>
            <Button
              title='Change to light theme'
              onClick={() => setTheme('light')}
              variant={'ghost'}
              className={`h-fit w-fit flex flex-col gap-2 items-center border ${theme === 'light' ? 'border-yellow-400' : 'border-transparent'}`}
            >
              <div className='lightmode w-56 h-fit p-1 border rounded-lg border-neutral-200'>
                <div className='w-full h-fit bg-white rounded-lg space-y-2 p-1'>
                  <div className='w-full h-fit bg-neutral-100 p-2 rounded-lg space-y-1 border border-neutral-200'>
                    <div className='w-20 h-4 bg-neutral-200 rounded-lg' />
                    <div className='w-full h-4 bg-neutral-200 rounded-lg' />
                  </div>
                  <div className='w-full h-fit bg-neutral-100 rounded-lg flex items-center gap-2 p-2 border border-neutral-200'>
                    <div className='w-6 h-6 bg-neutral-200 rounded-full border border-yellow-400' />
                    <div className='w-30 h-4 bg-neutral-200 rounded-lg' />
                  </div>
                  <div className='w-full h-fit bg-neutral-100 rounded-lg p-2 border border-neutral-200'>
                    <div className='w-full h-4 bg-neutral-200 rounded-lg border border-yellow-400' />
                  </div>
                </div>
              </div>
              <p>{t('light_theme')}</p>
            </Button>

            <Button
              title='Change to dark theme'
              onClick={() => setTheme('dark')}
              variant={'ghost'}
              className={`h-fit w-fit flex flex-col gap-2 items-center border ${theme === 'dark' ? 'border-yellow-400' : 'border-transparent'}`}
            >
              <div className='darkmode w-56 h-fit p-1 border rounded-lg border-neutral-400'>
                <div
                  className='w-full h-fit rounded-lg space-y-2 p-1'
                  style={{
                    background: 'hsl(20 14.3% 4.1%)',
                  }}
                >
                  <div
                    className='w-full h-fit p-2 rounded-lg space-y-1 border border-neutral-700'
                    style={{
                      background: 'hsl(20 14.3% 4.1%)',
                    }}
                  >
                    <div
                      className='w-20 h-4 rounded-lg'
                      style={{ background: 'hsl(12 6.5% 15.1%)' }}
                    />
                    <div
                      className='w-full h-4 rounded-lg'
                      style={{ background: 'hsl(12 6.5% 15.1%)' }}
                    />
                  </div>
                  <div
                    className='w-full h-fit rounded-lg flex items-center gap-2 p-2 border border-neutral-700'
                    style={{
                      background: 'hsl(20 14.3% 4.1%)',
                    }}
                  >
                    <div
                      className='w-6 h-6 rounded-full border border-yellow-400'
                      style={{ background: 'hsl(12 6.5% 15.1%)' }}
                    />
                    <div
                      className='w-30 h-4 rounded-lg'
                      style={{ background: 'hsl(12 6.5% 15.1%)' }}
                    />
                  </div>
                  <div
                    className='w-full h-fit rounded-lg p-2 border border-neutral-700'
                    style={{
                      background: 'hsl(20 14.3% 4.1%)',
                    }}
                  >
                    <div
                      className='w-full h-4 rounded-lg border border-yellow-400'
                      style={{ background: 'hsl(12 6.5% 15.1%)' }}
                    />
                  </div>
                </div>
              </div>
              <p>{t('dark_theme')}</p>
            </Button>
          </div>
        </section>
      </div>

      {cookiesShown && (
        <div className='w-full h-screen fixed grid place-items-center left-0 top-0 bg-black/30 z-[100]'>
          <DetailedCookiePopup
            language={language}
            popup={setCookiesShown}
            onClose={() => {
              const accountElement = document.getElementById('account')
              if (accountElement) {
                accountElement.style.zIndex = '0'
              }
            }}
          />
        </div>
      )}
    </section>
  )
}
