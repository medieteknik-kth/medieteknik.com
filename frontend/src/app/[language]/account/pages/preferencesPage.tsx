'use client'

import '/node_modules/flag-icons/css/flag-icons.min.css'
import { supportedLanguages } from '@/app/i18n/settings'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useTheme } from 'next-themes'
import DetailedCookiePopup from '@/components/cookie/DetailedCookie'
import BetaTag from '@/components/tags/Tags'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

export default function PreferencesPage({
  params: { language },
}: {
  params: { language: string }
}) {
  const router = useRouter()
  const params = useSearchParams()
  const path = usePathname()
  const [cookiesShown, setCookiesShown] = useState(false)
  const { theme, setTheme } = useTheme()

  const switchLanguage = useCallback(
    (newLanguage: string) => {
      const newPath = path.replace(/^\/[a-z]{2}/, `/${newLanguage}`)
      const category = params.get('category') || 'account'
      router.push(newPath + '?' + new URLSearchParams({ category }))
    },
    [path, params, router]
  )

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
    <section className='grow min-h-[1080px] h-full bg-white dark:bg-[#111] text-black dark:text-white'>
      <div className='w-full flex items-center justify-center border-b-2 border-yellow-400'>
        <h1 className='text-2xl py-4'>Preferences</h1>
      </div>
      <div className='w-full h-full grid grid-cols-6 auto-rows-max'>
        <section className='w-full flex items-center ml-20 mt-10 flex-col justify-between'>
          <div>
            <h2 className='text-2xl font-bold mb-2'>Language</h2>
            <div>
              <ul className='flex'>
                {supportedLanguages.map((lang) => (
                  <li key={lang} className='mr-2 mb-2'>
                    <Button
                      title='Switch Language'
                      onClick={() => switchLanguage(lang)}
                      disabled={lang === language}
                      variant={lang === language ? 'default' : 'secondary'}
                    >
                      <span className={`fi fi-${getFlagCode(lang)} mr-2`} />
                      <p>{getLanguageName(lang)}</p>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className='w-full flex items-center ml-20 mt-10 flex-col justify-between'>
          <div>
            <h2 className='text-2xl font-bold mb-2'>Privacy</h2>
            <div>
              <Button
                title='Cookie Settings'
                onClick={() => setCookiesShown(true)}
                variant='secondary'
              >
                Cookie Settings
              </Button>
            </div>
          </div>
        </section>

        <section className='w-full flex items-center ml-20 mt-10 flex-col justify-between'>
          <div>
            <h2 className='text-2xl font-bold mb-2 flex items-center'>
              Theme
              <BetaTag />
            </h2>

            <div className='flex'>
              <Button
                title='Change to light theme'
                onClick={() => setTheme('light')}
                disabled={theme === 'light'}
                variant={theme === 'light' ? 'default' : 'secondary'}
              >
                <SunIcon className='w-6 h-6 mr-2' />
                Light Theme
              </Button>

              <Button
                title='Change to dark theme'
                onClick={() => setTheme('dark')}
                disabled={theme === 'dark'}
                className='ml-2'
                variant={theme === 'dark' ? 'default' : 'secondary'}
              >
                <MoonIcon className='w-6 h-6 mr-2' />
                Dark Theme
              </Button>
            </div>
          </div>
        </section>
      </div>

      {cookiesShown && (
        <div className='w-full h-screen fixed grid place-items-center left-0 top-0 bg-black/30 z-50'>
          <DetailedCookiePopup params={{ language, popup: setCookiesShown }} />
        </div>
      )}
    </section>
  )
}
