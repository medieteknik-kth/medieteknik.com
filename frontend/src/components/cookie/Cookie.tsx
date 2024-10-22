'use client'

import { useTranslation } from '@/app/i18n/client'
import {
  COOKIE_CONSENT_STORAGE_KEY,
  DEFAULT_COOKIE_SETTINGS,
} from '@/utility/CookieManager'
import { useEffect, useState } from 'react'
import DetailedCookiePopup from './DetailedCookie'

export default function CookiePopup({ language }: { language: string }) {
  const { t } = useTranslation(language, 'cookies')

  const [showPopup, setShowPopup] = useState(false)
  const [showDetailedPopup, setShowDetailedPopup] = useState(false)

  async function saveSettings(allowedAll: boolean = false) {
    if (!allowedAll) {
      window.localStorage.setItem(
        COOKIE_CONSENT_STORAGE_KEY,
        JSON.stringify(DEFAULT_COOKIE_SETTINGS)
      )
    }

    const settings = {
      NECESSARY: true,
      FUNCTIONAL: true,
      ANALYTICS: true,
      PERFORMANCE: true,
      ADVERTISING: true,
    }
    window.localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify(settings)
    )
  }

  useEffect(() => {
    window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) === null &&
      setShowPopup(true)
  }, [setShowPopup])

  if (!showPopup) return <></>

  return (
    <div
      role='dialog'
      aria-modal='true'
      className={`w-full h-screen fixed grid place-items-center top-0 bg-black/30 z-50`}
    >
      <div className='w-full sm:w-[512px] h-[512px] fixed bg-white border-2 border-black/50 rounded-2xl'>
        <div className='flex flex-col mx-8 h-full justify-between'>
          <div className='h-1/2 flex flex-col justify-evenly'>
            <h2 id='cookie-title' className='font-bold text-4xl'>
              {t('title')}
            </h2>
            <p id='cookie-description' className='text-xl'>
              {t('description')}
            </p>
          </div>
          <div className='h-5/6 flex flex-col items-start justify-evenly'>
            <button
              className='w-full h-16 border-2 border-transparent bg-yellow-600 text-white rounded-2xl'
              onClick={() => {
                saveSettings(true)
                setShowPopup(false)
              }}
            >
              {t('btn_acceptAll')}
            </button>
            <button
              className='w-full h-16 border-2 border-transparent bg-yellow-600 text-white rounded-2xl'
              onClick={() => {
                setShowDetailedPopup(true)
              }}
            >
              {t('btn_personalize')}
            </button>
            <button
              className='w-full h-16 border-2 border-black bg-white text-black rounded-2xl'
              onClick={() => {
                saveSettings()
                setShowPopup(false)
              }}
            >
              {t('btn_acceptNecessary')}
            </button>
          </div>
        </div>
      </div>
      {showDetailedPopup && (
        <DetailedCookiePopup params={{ language, popup: setShowPopup }} />
      )}
    </div>
  )
}
