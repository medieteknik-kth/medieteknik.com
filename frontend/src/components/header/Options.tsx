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
import { Badge } from '@/components/ui/badge'
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

export default function OptionsHeader({ language }: { language: string }) {
  const router = useRouter()
  const path = usePathname()
  const { t } = useTranslation(language, 'header')
  const { theme, setTheme } = useTheme()
  const [isClient, setIsClient] = useState(false)
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
    return null
  }

  const languageFlags = new Map([
    ['en', 'gb'],
    ['se', 'se'],
  ])

  const languageNames = new Map([
    ['en', 'English'],
    ['se', 'Svenska'],
  ])

  const getFlagCode = (lang: string) => {
    return languageFlags.get(lang) || 'xx'
  }

  const getLanguageName = (lang: string) => {
    return languageNames.get(lang) || 'Unknown'
  }

  return (
    <div className='w-20 z-10'>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            className='w-fit h-full px-4 grid z-10 place-items-center'
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
              <CardTitle>{t('preferences')}</CardTitle>
            </CardHeader>
            <CardContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel className='text-lg'>
                  {t('languagePreference')}
                </DropdownMenuLabel>
                <DropdownMenuGroup className='flex'>
                  {supportedLanguages.map((lang: string) => {
                    return (
                      <DropdownMenuItem key={lang} asChild>
                        <Button
                          onClick={() => switchLanguage(lang)}
                          className='mx-1 cursor-pointer'
                          variant={lang === language ? 'default' : 'ghost'}
                          disabled={lang === language}
                          title={`Switch to ${getLanguageName(lang)}`}
                          aria-label={`Switch to ${getLanguageName(lang)}`}
                        >
                          <div className='w-full h-full flex items-center px-4'>
                            <span
                              className={`fi fi-${getFlagCode(lang)} w-6 h-6`}
                            />
                            <span className='ml-2'>
                              {getLanguageName(lang)}
                            </span>
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
                  {t('themePreference')}
                  <Badge className='ml-2' variant='destructive'>
                    BETA
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuGroup className='flex'>
                  <DropdownMenuItem asChild>
                    <Button
                      onClick={() => switchTheme('light')}
                      className='mx-1 cursor-pointer'
                      variant={theme === 'light' ? 'default' : 'ghost'}
                      disabled={theme === 'light'}
                      title='Switch to Light Theme'
                      aria-label='Switch to Light Theme'
                    >
                      <div className='w-full h-full flex items-center px-4'>
                        <SunIcon className='w-6 h-6' />
                        <span className='ml-2'>Light</span>
                      </div>
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Button
                      onClick={() => switchTheme('dark')}
                      className='mx-1 cursor-pointer'
                      variant={theme === 'dark' ? 'default' : 'ghost'}
                      disabled={theme === 'dark'}
                      title='Switch to Dark Theme'
                      aria-label='Switch to Dark Theme'
                    >
                      <div className='w-full h-full flex items-center px-4'>
                        <MoonIcon className='w-6 h-6' />
                        <span className='ml-2'>Dark</span>
                      </div>
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuGroup>
            </CardContent>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
