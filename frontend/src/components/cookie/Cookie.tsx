'use client'
import { useState, useEffect } from 'react'
import { ClientCookieConsent } from '@/utility/CookieManager'
import { useTranslation } from '@/app/i18n/client'
import DetailedCookiePopup from './DetailedCookie'

export default function CookiePopup({
  params: { language },
}: {
  params: { language: string }
}) {
  const { t } = useTranslation(language, 'cookies')
  let clientCookies = undefined
  const [showPopup, setShowPopup] = useState(false)
  const [showDetailedPopup, setShowDetailedPopup] = useState(false)

  function saveSettings(allowedAll: boolean = false) {
    clientCookies = new ClientCookieConsent(window)

    if (!allowedAll) {
      clientCookies.updateCookieSettings(clientCookies.getDefaultSettings())
      return
    }

    clientCookies.updateCookieSettings({
      NECESSARY: true,
      FUNCTIONAL: true,
      ANALYTICS: true,
      PERFORMANCE: true,
      ADVERTISING: true,
    })
  }

  useEffect(() => {
    const clientCookies = new ClientCookieConsent(window)
    const cookieSettings = clientCookies.retrieveCookieSettings()
    if (cookieSettings) return
    setShowPopup(true)
  }, [setShowPopup])
  
  if (!showPopup) return <></>

  return (
    <div
      className={`w-full h-screen fixed grid place-items-center top-0 bg-black/30 z-50`}
    >
      <div className='w-full sm:w-[512px] h-[512px] fixed bg-white border-2 border-black/50 rounded-2xl'>
        <div className='flex flex-col mx-8 h-full justify-between'>
          <div className='h-1/2 flex flex-col justify-evenly'>
            <h2 className='font-bold text-4xl'>{t('title')}</h2>
            <p className='text-xl'>{t('description')}</p>
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
