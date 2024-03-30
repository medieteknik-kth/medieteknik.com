'use client'
import { supportedLanguages } from '@/app/i18n/settings'
import { useTranslation } from '@/app/i18n/client'
import { useRouter, usePathname } from 'next/navigation'
import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import { useState, useCallback } from 'react'
import '/node_modules/flag-icons/css/flag-icons.min.css'

export default function OptionsHeader({
  params: { language },
}: {
  params: { language: string }
}) {
  const router = useRouter()
  const path = usePathname()
  const { t } = useTranslation(language, 'header')
  const [isOpen, setIsOpen] = useState(false)

  const switchLanguage = useCallback(
    (newLanguage: string) => {
      const newPath = path.replace(/^\/[a-z]{2}/, `/${newLanguage}`)

      router.push(newPath)
    },
    [path, router]
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
    <div className='w-20 mr-2 z-10'>
      <div
        className={`w-screen h-screen ${
          isOpen ? 'block' : 'hidden'
        } fixed -z-10 left-0 top-0`}
        onClick={() => setIsOpen(false)}
      />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-fit h-full px-4 grid z-10 place-items-center border-b-2 ${
          isOpen
            ? 'border-yellow-400 bg-black/75'
            : 'border-transparent bg-transparent'
        } hover:border-yellow-400 hover:bg-black/75`}
        title='Preferences'
        aria-label='Preferences Button'
        aria-expanded={isOpen}
      >
        <Cog8ToothIcon className='w-8 h-8 text-white' />
      </button>

      <div
        className={`min-w-60 w-1/2 md:w-96 h-96 flex-col bg-white absolute border-2 text-black border-gray-300 border-t-0 ${
          isOpen ? 'flex' : 'hidden'
        } top-24 right-[104px] xl:right-[88px] z-50`}
        role='dialog'
      >
        <h1 className='text-2xl text-center my-4 uppercase tracking-wider'>
          {t('preferences')}
        </h1>
        <section className='w-full h-24 px-4'>
          <h2 className='h-fit text-xl font-bold text-left py-2 border-b-2 border-yellow-400'>
            {t('languagePreference')}
          </h2>
          <div className='h-12 flex overflow-x-auto'>
            {supportedLanguages.map((lang: string) => (
              <button
                type='submit'
                key={lang}
                onClick={() => {
                  switchLanguage(lang)
                  setIsOpen(false)
                }}
                disabled={lang === language}
                className='w-20 h-full px-4 grid place-items-center border-b-2 border-transparent enabled:hover:border-yellow-400 enabled:hover:bg-black/10 disabled:opacity-50 disabled:cursor-not-allowed'
                title={getLanguageName(lang)}
                aria-label={getLanguageName(lang)}
              >
                <span className={`fi fi-${getFlagCode(lang)}`}></span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
