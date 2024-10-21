'use client'

import { useTranslation } from '@/app/i18n/client'
import { cookieName, supportedLanguages } from '@/app/i18n/settings'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LanguageCode } from '@/models/Language'
import { LANGUAGES } from '@/utility/Constants'
import { ClientCookieConsent, CookieConsent } from '@/utility/CookieManager'
import { Cog8ToothIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useCookies } from 'next-client-cookies'
import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import DetailedCookiePopup from '../../cookie/DetailedCookie'
import '/node_modules/flag-icons/css/flag-icons.min.css'

interface Props {
  language: string
}

/**
 * @name OptionsMenu
 * @description Renderes a options menu for non-logged in users
 *
 * @param {Props} props
 * @param {string} props.language - The current language of the page
 * @returns {JSX.Element} The options menu
 */
export default function OptionsMenu({ language }: Props): JSX.Element {
  const router = useRouter()
  const path = usePathname()
  const { t } = useTranslation(language, 'preferences')
  const { theme, setTheme } = useTheme()
  const [isClient, setIsClient] = useState(false)
  const [cookiesShown, setCookiesShown] = useState(false)
  const cookies = useCookies()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  /**
   * @name switchLanguage
   * @description Switches the language of the page
   * @param {string} newLanguage - The new language to switch to
   * @returns {void}
   */
  const switchLanguage = useCallback(
    (newLanguage: string) => {
      const newPath = path.replace(/^\/[a-z]{2}/, `/${newLanguage}`)
      const clientCookiesConsent = new ClientCookieConsent(window)
      if (clientCookiesConsent.isCategoryAllowed(CookieConsent.FUNCTIONAL)) {
        cookies.set(cookieName, newLanguage, { path: '/' })
      }
      router.push(newPath)
    },
    [path, router]
  )

  /**
   * @name switchTheme
   * @description Switches the theme of the page
   * @param {string} newTheme - The new theme to switch to
   * @returns {void}
   */
  const switchTheme = useCallback(
    (newTheme: string) => {
      void setTheme(newTheme)
      const clientCookies = new ClientCookieConsent(window)
      if (clientCookies.isCategoryAllowed(CookieConsent.FUNCTIONAL)) {
        cookies.set('theme', newTheme, {
          path: '/',
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
          sameSite: 'lax',
          secure: true,
        })
      }
    },
    [setTheme, cookies]
  )

  if (!isClient) {
    return <></>
  }

  return (
    <div className='w-fit z-10'>
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            className='w-16 h-full grid z-10 place-items-center rounded-none'
            title={t('title')}
            aria-label='Preferences Button'
            size='icon'
            variant='ghost'
          >
            <Cog8ToothIcon className='w-7 h-7' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent asChild>
          <Card>
            <CardHeader>
              <CardTitle>{t('title')}</CardTitle>
              <CardDescription>{t('description')}</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
              <div>
                <h4 className='text-lg font-semibold pb-1 tracking-wide'>
                  {t('language')}
                </h4>
                {supportedLanguages.map((lang) => (
                  <Button
                    key={lang}
                    onClick={() => {
                      setOpen(false)
                      switchLanguage(lang)
                    }}
                    className='mx-1 cursor-pointer'
                    variant={lang === language ? 'default' : 'ghost'}
                    disabled={lang === language}
                    title={`Switch to ${LANGUAGES[lang as LanguageCode].flag}`}
                    aria-label={`Switch to ${
                      LANGUAGES[lang as LanguageCode].name
                    }`}
                  >
                    <div className='w-full h-full flex items-center px-4'>
                      <span
                        className={`fi fi-${LANGUAGES[lang].flag} w-6 h-6`}
                      />
                      <span className='ml-2'>{LANGUAGES[lang].name}</span>
                    </div>
                  </Button>
                ))}
              </div>

              <div>
                <h4 className='text-lg font-semibold pb-1 tracking-wide'>
                  {t('theme')}
                  <sup className='ml-1 text-xs text-red-600 select-none uppercase'>
                    Beta
                  </sup>
                </h4>
                <Button
                  onClick={() => switchTheme('light')}
                  className='mx-1 cursor-pointer'
                  variant={theme === 'light' ? 'default' : 'ghost'}
                  disabled={theme === 'light'}
                  title={t('light_theme')}
                  aria-label={t('light_theme')}
                >
                  <div className='w-full h-full flex items-center px-4'>
                    <SunIcon className='w-6 h-6' />
                    <span className='ml-2'>{t('light_theme')}</span>
                  </div>
                </Button>
                <Button
                  onClick={() => switchTheme('dark')}
                  className='mx-1 cursor-pointer'
                  variant={theme === 'dark' ? 'default' : 'ghost'}
                  disabled={theme === 'dark'}
                  title={t('dark_theme')}
                  aria-label={t('dark_theme')}
                >
                  <div className='w-full h-full flex items-center px-4'>
                    <MoonIcon className='w-6 h-6' />
                    <span className='ml-2'>{t('dark_theme')}</span>
                  </div>
                </Button>
              </div>

              <div>
                <h4 className='text-lg font-semibold pb-1 tracking-wide'>
                  {t('privacy')}
                </h4>
                <Button
                  onClick={() => {
                    setCookiesShown(true)
                    setOpen(false)
                  }}
                  className='w-full'
                  variant='secondary'
                  title={t('cookie_settings')}
                  aria-label={t('cookie_settings')}
                >
                  {t('cookie_settings')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>

      {cookiesShown && (
        <div className='w-full h-screen fixed grid place-items-center left-0 top-0 bg-black/30 z-50'>
          <DetailedCookiePopup params={{ language, popup: setCookiesShown }} />
        </div>
      )}
    </div>
  )
}
