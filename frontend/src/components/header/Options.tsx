'use client'
import { supportedLanguages } from '@/app/i18n/settings'
import { useTranslation } from '@/app/i18n/client'
import { useRouter, usePathname } from 'next/navigation'
import { Cog8ToothIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useState, useCallback, useEffect } from 'react'
import { useTheme } from 'next-themes'
import '/node_modules/flag-icons/css/flag-icons.min.css'
import { ClientCookieConsent, CookieConsent } from '@/utility/CookieManager'
import { useCookies } from 'next-client-cookies'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cookieName } from '@/app/i18n/settings'
import { LANGUAGES } from '@/utility/Constants'
import { LanguageCode } from '@/models/Language'
import DetailedCookiePopup from '../cookie/DetailedCookie'

/**
 * OptionsMenu
 * @description Renderes a options menu for non-logged in users
 *
 * @param {string} language - The current language of the page
 * @returns {JSX.Element} The options menu
 */
export default function OptionsMenu({
  language,
}: {
  language: string
}): JSX.Element {
  const router = useRouter()
  const path = usePathname()
  const { t } = useTranslation(language, 'preferences')
  const { theme, setTheme } = useTheme()
  const [isClient, setIsClient] = useState(false)
  const [cookiesShown, setCookiesShown] = useState(false)
  const cookies = useCookies()

  useEffect(() => {
    setIsClient(true)
  }, [])

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
    <div className='w-20 z-10'>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            className='w-fit h-full px-4 grid z-10 place-items-center rounded-none'
            title='Preferences'
            aria-label='Preferences Button'
            size='icon'
            variant='ghost'
          >
            <Cog8ToothIcon className='w-8 h-8' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent asChild>
          <Card>
            <CardHeader>
              <CardTitle>{t('title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel className='text-lg'>
                  {t('language')}
                </DropdownMenuLabel>
                <DropdownMenuGroup className='flex'>
                  {supportedLanguages.map((lang) => {
                    return (
                      <DropdownMenuItem key={lang} asChild>
                        <Button
                          onClick={() => switchLanguage(lang)}
                          className='mx-1 cursor-pointer'
                          variant={lang === language ? 'default' : 'ghost'}
                          disabled={lang === language}
                          title={`Switch to ${
                            LANGUAGES[lang as LanguageCode].flag
                          }`}
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
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuGroup>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className='text-lg flex items-center'>
                  {t('theme')}
                  <sup className='ml-1 text-xs text-red-600 select-none uppercase'>
                    Beta
                  </sup>
                </DropdownMenuLabel>
                <DropdownMenuGroup className='flex'>
                  <DropdownMenuItem asChild>
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
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
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
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className='text-lg'>
                  {t('privacy')}
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Button
                    onClick={() => setCookiesShown(true)}
                    className='w-full'
                    variant='secondary'
                    title={t('cookie_settings')}
                    aria-label={t('cookie_settings')}
                  >
                    {t('cookie_settings')}
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
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
