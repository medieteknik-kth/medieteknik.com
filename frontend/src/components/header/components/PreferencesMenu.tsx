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
  const { t } = useTranslation(language, 'preferences')
  const [isClient, setIsClient] = useState(false)
  const { theme, setTheme } = useTheme()

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
        <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
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
        <DropdownMenuLabel>{t('theme')}</DropdownMenuLabel>
        <DropdownMenuItem className='p-0'>
          <Button
            variant='ghost'
            className='w-full flex items-center justify-between gap-2 p-0 pl-2'
            disabled={theme === 'light'}
            onClick={() => switchTheme('light')}
            title={t('light_theme')}
            aria-label={t('light_theme')}
          >
            <div className='w-full h-full flex items-center gap-2'>
              <SunIcon className='w-5 h-5' />
              <span>{t('light_theme')}</span>
            </div>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className='p-0'>
          <Button
            variant='ghost'
            className='w-full flex items-center justify-between gap-2 p-0 pl-2'
            disabled={theme === 'dark'}
            onClick={() => switchTheme('dark')}
            title={t('dark_theme')}
            aria-label={t('dark_theme')}
          >
            <div className='w-full h-full flex items-center gap-2'>
              <MoonIcon className='w-5 h-5' />
              <span>{t('dark_theme')}</span>
            </div>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  )
}
