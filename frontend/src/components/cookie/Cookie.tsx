'use client'
import { useState, useEffect } from 'react'
import { useCookies } from 'next-client-cookies'
import { CookieConsent, COOKIE_CONSENT_STORAGE_KEY, ClientCookieConsent } from '@/utility/CookieConsent'
import { useTranslation } from '@/app/i18n/client'

export default function CookiePopup({ params: { language } }: { params: { language: string }}) {
  const { t } = useTranslation(language, 'cookies')
  const [showPopup, setShowPopup] = useState(false)
  const cookies = useCookies()

  useEffect(() => {
    const cookieConsent = new ClientCookieConsent(window)
    if (cookieConsent.retrieveCookieConsentStatus() === CookieConsent.NONE) { setShowPopup(true) }  
    else { setShowPopup(false) }
  }, [])

  function setAllowed(consent: CookieConsent) {
    const cookieConsent = new ClientCookieConsent(window)
    setShowPopup(false)
    cookieConsent.updateCookieConsentStatus(consent)
  }

  if(!showPopup) return (<></>)

  return (
    <div className={`w-full h-screen fixed grid place-items-center top-0 bg-black/30`}>
      <div className='w-full sm:w-[512px] h-[512px] fixed bg-white border-2 border-black/50 rounded-2xl'>
        <div className='flex flex-col mx-8 h-full justify-between'>
          <div className='h-1/2 flex flex-col justify-evenly'>
            <h2 className='font-bold text-4xl'>{t("title")}</h2>
            <p className='text-xl'>{t("description")}</p>
          </div>
          <div className='h-1/2 flex flex-col items-start justify-evenly'>
            <button className='w-full h-16 border-2 border-transparent bg-yellow-600 text-white rounded-2xl' onClick={() => {
              setAllowed(CookieConsent.ALLOWED)
              cookies.set(COOKIE_CONSENT_STORAGE_KEY, CookieConsent.ALLOWED)
            }}>{t('btn_acceptAll')}</button>
            <button className='w-full h-16 border-2 border-transparent bg-yellow-600 text-white rounded-2xl' onClick={() => {
              setAllowed(CookieConsent.NECESSARY)
              cookies.set(COOKIE_CONSENT_STORAGE_KEY, CookieConsent.NECESSARY)
            }}>{t('btn_acceptNecessary')}</button>
            <button className='w-full h-16 border-2 border-black/40 rounded-2xl' onClick={() => {
              setAllowed(CookieConsent.NONE)
            }}>{t('btn_blockAll')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}