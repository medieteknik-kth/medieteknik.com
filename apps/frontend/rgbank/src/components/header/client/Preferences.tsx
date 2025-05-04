'use client'

import { useTranslation } from '@/app/i18n/client'
import PreferencesMenu from '@/components/header/components/PreferencesMenu'
import { changeLanguage } from '@/components/server/changeLanguage'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import type { LanguageCode } from '@/models/Language'
import { LANGUAGES, SUPPORTED_LANGUAGES } from '@/utility/Constants'
import {
  AdjustmentsHorizontalIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  language: LanguageCode
}

export default function Preferences({ language }: Props) {
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
      <div className='hidden md:block'>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className='p-0 pr-2'>
              <Button
                className='w-full flex items-center justify-start gap-2 p-0 pl-2'
                variant={'ghost'}
              >
                <AdjustmentsHorizontalIcon className='w-4 h-4' />
                <span>{t('preferences')}</span>
              </Button>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className='w-[200px] mr-2 dark:bg-[#111]'>
                <PreferencesMenu language={language} />
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </div>
      <div className='md:hidden'>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className='w-full flex items-center justify-start gap-2 p-0 pl-2'
              variant={'ghost'}
            >
              <AdjustmentsHorizontalIcon className='w-4 h-4' />
              <span>{t('preferences')}</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('preferences')}</DialogTitle>
              <DialogDescription>
                {t('preferences.description')}
              </DialogDescription>
            </DialogHeader>
            <div>
              <Label>{t('preferences.language.title')}</Label>
              <div className='flex flex-col gap-2'>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <Button
                    variant='ghost'
                    className='w-full flex items-center justify-between gap-2 p-0 pl-2'
                    disabled={lang === language}
                    onClick={() => changeLanguage(lang, path)}
                    title={`Switch to ${LANGUAGES[lang].name}`}
                    aria-label={`Switch to ${LANGUAGES[lang].name}`}
                    key={lang}
                  >
                    <div className='w-full h-full flex items-center gap-2'>
                      <span className='w-5 h-5'>
                        {LANGUAGES[lang as LanguageCode].flag_icon}
                      </span>
                      <span>{LANGUAGES[lang].name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label>{t('preferences.theme.title')}</Label>
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
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
