'use client'

import { useTranslation } from '@/app/i18n/client'
import { changeLanguage } from '@/components/server/changeLanguage'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import type { LanguageCode } from '@/models/Language'
import { LANGUAGES, SUPPORTED_LANGUAGES } from '@/utility/Constants'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { type JSX, useCallback, useEffect, useState } from 'react'

interface Props {
  language: LanguageCode
}

export default function PreferencesMenu({ language }: Props): JSX.Element {
  const path = usePathname()
  const [isClient, setIsClient] = useState(false)
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation(language, 'profile')
  useEffect(() => {
    setIsClient(true)
  }, [])

  /**
   * @name switchTheme
   * @description Switches the theme of the page
   * @param {string} newTheme - The new theme to switch to
   * @returns {void}
   */
  const switchTheme = useCallback(
    (newTheme: string) => {
      void setTheme(newTheme)
      window.localStorage.setItem('theme', newTheme)
    },
    [setTheme]
  )

  if (!isClient) {
    return <></>
  }

  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuLabel>{t('preferences.language.title')}</DropdownMenuLabel>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem className='p-0' key={lang}>
            <Button
              variant='ghost'
              className='w-full flex items-center justify-between gap-2 p-0 pl-2'
              disabled={lang === language}
              onClick={() => changeLanguage(lang, path)}
              title={`Switch to ${LANGUAGES[lang].name}`}
              aria-label={`Switch to ${LANGUAGES[lang].name}`}
            >
              <div className='w-full h-full flex items-center gap-2'>
                <span className='w-5 h-5'>
                  {LANGUAGES[lang as LanguageCode].flag_icon}
                </span>

                <span>{LANGUAGES[lang].name}</span>
              </div>
            </Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel>{t('preferences.theme.title')}</DropdownMenuLabel>
        <DropdownMenuItem className='p-0'>
          <Button
            variant='ghost'
            className='w-full flex items-center justify-between gap-2 p-0 pl-2'
            disabled={theme === 'light'}
            onClick={() => switchTheme('light')}
            title={t('preferences.theme.light')}
            aria-label={t('preferences.theme.light')}
          >
            <div className='w-full h-full flex items-center gap-2'>
              <SunIcon className='w-5 h-5' />
              <span>{t('preferences.theme.light')}</span>
            </div>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className='p-0'>
          <Button
            variant='ghost'
            className='w-full flex items-center justify-between gap-2 p-0 pl-2'
            disabled={theme === 'dark'}
            onClick={() => switchTheme('dark')}
            title={t('preferences.theme.dark')}
            aria-label={t('preferences.theme.dark')}
          >
            <div className='w-full h-full flex items-center gap-2'>
              <MoonIcon className='w-5 h-5' />
              <span>{t('preferences.theme.dark')}</span>
            </div>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  )
}
