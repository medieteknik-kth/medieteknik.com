'use client'
import './cookieStyle.css'
import { useState, Dispatch, SetStateAction } from 'react'
import { ClientCookieConsent, CookieConsent } from '@/utility/CookieManager'
import { PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/app/i18n/client'
import Logo from '/public/images/logo.png'
import Link from 'next/link'
import Image from 'next/image'

interface AvailableCookieSettings {
  NECESSARY: boolean
  FUNCTIONAL: boolean
  ANALYTICS: boolean
  PERFORMANCE: boolean
  ADVERTISING: boolean
}

export default function DetailedCookiePopup({
  params: { language, popup },
}: {
  params: { language: string; popup: Dispatch<SetStateAction<boolean>> }
}) {
  const cookieTranslation = useTranslation(language, 'cookies').t
  const commonTranslation = useTranslation(language, 'common').t
  const [sliders, setSliders] = useState({
    NECESSARY: true,
    FUNCTIONAL: false,
    ANALYTICS: false,
    PERFORMANCE: false,
    ADVERTISING: false,
  })

  const [dropdowns, setDropdowns] = useState({
    NECESSARY: false,
    FUNCTIONAL: false,
    ANALYTICS: false,
    PERFORMANCE: false,
    ADVERTISING: false,
  })

  const updateSlider = (sliderName: CookieConsent, value: boolean) => {
    if (sliderName === 'NECESSARY') return
    setSliders((prev) => ({
      ...prev,
      [sliderName]: value,
    }))
  }

  const updateDropdowns = (dropdownName: CookieConsent, value: boolean) => {
    setDropdowns((prev) => ({
      ...prev,
      [dropdownName]: value,
    }))
  }

  function saveCookieSettings(newSettings: AvailableCookieSettings) {
    popup(false)
    const clientCookies = new ClientCookieConsent(window)
    clientCookies.updateCookieSettings(newSettings)
  }

  const availableCookies: string[] = Object.values(CookieConsent)

  return (
    <div className='w-full lg:w-1/2 2xl:w-1/4 h-5/6 fixed top-20 rounded-3xl overflow-hidden bg-white border-r-2 border-black'>
      <div className='w-full flex items-center py-4 border-b-2 border-black/50 mb-4 pl-8'>
        <Image src={Logo.src} alt='Company Logo' width='46' height='46' />
        <h1 className='text-3xl ml-4'>{commonTranslation('title')}</h1>
        <button
          className='w-8 h-8 ml-auto mr-8'
          onClick={() => {
            saveCookieSettings(sliders)
          }}
        >
          <XMarkIcon className='w-8 h-8 ' />
        </button>
      </div>
      <div className='w-full h-5/6 px-8 overflow-y-scroll absolute flex flex-col'>
        <div className='w-full mb-4'>
          <h2 className='text-2xl'>{cookieTranslation('aboutPrivacy')}</h2>
          <p className='text-sm'>{cookieTranslation('privacyStatement')}.</p>
          <div className='w-full flex my-2'>
            <Link href='/privacy#policy' className='text-blue-500 mr-4'>
              {cookieTranslation('privacyPolicy')}
            </Link>
            <Link href='/privacy#cookies'>
              {cookieTranslation('cookiePolicy')}
            </Link>
          </div>

          <div className='w-full flex justify-between'>
            <button
              className='w-40 h-10 text-sm border-2 border-transparent bg-yellow-600 text-white rounded-2xl mt-2 hover:bg-yellow-500'
              onClick={() => {
                setSliders((prev) => {
                  const updatedSliders = {
                    ...prev,
                    FUNCTIONAL: true,
                    ANALYTICS: true,
                    PERFORMANCE: true,
                    ADVERTISING: true,
                  }
                  saveCookieSettings(updatedSliders)
                  return updatedSliders
                })
              }}
            >
              {cookieTranslation('btn_acceptAll')}
            </button>
            <button
              className='w-40 h-10 text-sm border-2 border-yellow-500 bg-white text-black rounded-2xl mt-2 hover:bg-black/20'
              onClick={() => {
                saveCookieSettings(sliders)
                return sliders
              }}
            >
              {cookieTranslation('btn_save')}
            </button>
          </div>
        </div>
        <div className='w-full flex flex-col'>
          {availableCookies.map((key, index) => {
            const cookie = key as
              | 'NECESSARY'
              | 'FUNCTIONAL'
              | 'ANALYTICS'
              | 'PERFORMANCE'
              | 'ADVERTISING'
            return (
              <div
                key={index}
                className='w-full flex flex-col mt-8 border-b-2 border-black/25 pb-4'
              >
                <div className='w-full flex justify-between '>
                  <div className='w-fit flex items-center'>
                    <button className='w-8 h-8' type='button'>
                      {dropdowns[cookie] ? (
                        <MinusIcon
                          className='w-8 h-8'
                          onClick={() => {
                            updateDropdowns(cookie, !dropdowns[cookie])
                          }}
                        />
                      ) : (
                        <PlusIcon
                          className='w-8 h-8'
                          onClick={() => {
                            updateDropdowns(cookie, !dropdowns[cookie])
                          }}
                        />
                      )}
                    </button>
                    <h3 className='ml-2 text-xl uppercase tracking-wider'>
                      {cookieTranslation('cookie_' + cookie)}
                    </h3>
                  </div>
                  <div
                    className='cookieSwitch w-16 h-9 relative inline-block focus:border-2 focus:border-black'
                    onClick={() => {
                      updateSlider(cookie, !sliders[cookie])
                    }}
                  >
                    <input type='checkbox' checked={sliders[cookie]} readOnly />
                    <span
                      className={`slider focus:border-2 focus:border-black ${
                        cookie === 'NECESSARY'
                          ? 'hover:cursor-not-allowed'
                          : 'hover:cursor-pointer'
                      }`}
                    />
                  </div>
                </div>
                {dropdowns[cookie] && (
                  <p className='px-8 mt-4 text-sm'>
                    {cookieTranslation('cookie_' + cookie + '_description')}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
