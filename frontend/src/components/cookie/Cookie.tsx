'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import { DEFAULT_COOKIE_SETTINGS } from '@/utility/CookieManager'
import { LOCAL_STORAGE_COOKIE_CONSENT } from '@/utility/LocalStorage'
import { JSX, useEffect, useState } from 'react'
import DetailedCookiePopup from './DetailedCookie'

interface Props {
  language: string
}

/**
 * @name CookiePopup
 * @description The basic cookie popup that asks the user to accept cookies, or to personalize their cookie settings.
 *
 * @param {Props} props
 * @param {string} props.language - The language of the application.
 * @returns {JSX.Element} The CookiePopup component.
 */
export default function CookiePopup({ language }: Props): JSX.Element {
  const { t } = useTranslation(language, 'cookies')
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')
  const [showDetailedPopup, setShowDetailedPopup] = useState(false)

  /**
   * @name saveSettings
   * @description Saves the cookie settings to the local storage.
   *
   * @param {boolean} allowedAll - Whether all cookies are allowed or not. Defaults to false.
   */
  function saveSettings(allowedAll: boolean = false) {
    if (!allowedAll) {
      window.localStorage.setItem(
        LOCAL_STORAGE_COOKIE_CONSENT,
        JSON.stringify(DEFAULT_COOKIE_SETTINGS)
      )
    }

    const settings = {
      NECESSARY: true,
      FUNCTIONAL: true,
      ANALYTICS: true,
      PERFORMANCE: true,
      ADVERTISING: true,
      THIRD_PARTY: true,
    }
    window.localStorage.setItem(
      LOCAL_STORAGE_COOKIE_CONSENT,
      JSON.stringify(settings)
    )
  }

  useEffect(() => {
    const cookieSettings = window.localStorage.getItem(
      LOCAL_STORAGE_COOKIE_CONSENT
    )
    if (!cookieSettings) {
      setShowPopup(true)
    } else {
      // Check if cookie settings contains all necessary keys
      const settings = JSON.parse(cookieSettings)
      const keys = Object.keys(DEFAULT_COOKIE_SETTINGS)
      const hasAllKeys = keys.every((key) => settings.hasOwnProperty(key))
      if (!hasAllKeys) {
        setMessage(t('outdated'))
        setShowPopup(true)
      }
    }
  }, [setShowPopup])

  if (!showPopup) return <></>

  return (
    <div
      role='dialog'
      aria-modal='true'
      className={`w-full h-screen fixed grid place-items-center top-0 bg-black/30 z-50`}
    >
      <div className='w-full sm:w-[512px] h-fit fixed bg-white dark:bg-[#111] border-2 border-black/50 dark:border-yellow-400/50 rounded-md'>
        <div className='flex flex-col px-8 gap-4'>
          <div className='h-fit flex flex-col gap-4 pt-8'>
            <h2 id='cookie-title' className='font-bold text-4xl'>
              {t('title')}
            </h2>
            <p id='cookie-description' className=''>
              {t('description')}
            </p>
            {message && <p className='text-red-500 text-sm'>{message}</p>}
          </div>
          <div className='h-fit flex flex-col gap-4 items-start pb-8'>
            <Button
              className='w-full h-16'
              onClick={() => {
                saveSettings(true)
                setShowPopup(false)
              }}
            >
              {t('btn_acceptAll')}
            </Button>
            <Button
              className='w-full h-16'
              onClick={() => {
                setShowDetailedPopup(true)
              }}
            >
              {t('btn_personalize')}
            </Button>
            <Button
              variant={'secondary'}
              className='w-full h-16 '
              onClick={() => {
                saveSettings()
                setShowPopup(false)
              }}
            >
              {t('btn_acceptNecessary')}
            </Button>
          </div>
        </div>
      </div>
      {showDetailedPopup && (
        <DetailedCookiePopup language={language} popup={setShowPopup} />
      )}
    </div>
  )
}
