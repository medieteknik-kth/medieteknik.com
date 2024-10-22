'use client'

import { useTranslation } from '@/app/i18n/client'
import { Switch } from '@/components/ui/switch'
import {
  CookieConsent,
  CookieSettings,
  DEFAULT_COOKIE_SETTINGS,
} from '@/utility/CookieManager'
import { LOCAL_STORAGE_COOKIE_CONSENT } from '@/utility/LocalStorage'
import {
  ComputerDesktopIcon,
  MinusIcon,
  PlusIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { Dispatch, JSX, SetStateAction, useState } from 'react'
import { Button } from '../ui/button'

interface Props {
  language: string
  popup: Dispatch<SetStateAction<boolean>>
}

/**
 * @name DetailedCookiePopup
 * @description The detailed cookie popup that allows the user to personalize their cookie settings.
 *
 * @param {Props} props
 * @param {string} props.language - The language of the application.
 * @param {Dispatch<SetStateAction<boolean>>} props.popup - The state setter for the popup.
 * @returns {JSX.Element} The DetailedCookiePopup component.
 */
export default function DetailedCookiePopup({
  language,
  popup,
}: Props): JSX.Element {
  const { t } = useTranslation(language, 'cookies')
  // TODO: Create a cookie popup context?

  const [sliders, setSliders] = useState({
    ...DEFAULT_COOKIE_SETTINGS,
  })

  const [dropdowns, setDropdowns] = useState({
    NECESSARY: false,
    FUNCTIONAL: false,
    ANALYTICS: false,
    PERFORMANCE: false,
    ADVERTISING: false,
    THIRD_PARTY: false,
  })

  /**
   * @name updateSlider
   * @description Updates the sliders in the detailed cookie popup.
   * @param {CookieConsent} sliderName - The name of the slider.
   * @param {boolean} value - The value of the slider.
   */
  const updateSlider = (sliderName: CookieConsent, value: boolean) => {
    setSliders((prev) => ({
      ...prev,
      NECESSARY: true,
      [sliderName]: value,
    }))
  }

  /**
   * @name updateDropdowns
   * @description Updates the dropdowns in the detailed cookie popup.
   * @param {CookieConsent} dropdownName - The name of the dropdown.
   * @param {boolean} value - The value of the dropdown.
   */
  const updateDropdowns = (dropdownName: CookieConsent, value: boolean) => {
    setDropdowns((prev) => ({
      ...prev,
      [dropdownName]: value,
    }))
  }

  /**
   * @name saveCookieSettings
   * @description Saves the cookie settings to the local storage.
   * @param {CookieSettings} newSettings - The new cookie settings.
   */
  function saveCookieSettings(newSettings: CookieSettings) {
    popup(false)
    window.localStorage.setItem(
      LOCAL_STORAGE_COOKIE_CONSENT,
      JSON.stringify(newSettings)
    )
  }

  const availableCookies: string[] = Object.values(CookieConsent)

  return (
    <div className='w-full lg:w-[750px] 2xl:w-[1000px] h-fit fixed top-28 rounded-3xl overflow-hidden bg-white dark:bg-[#111]'>
      <div className='w-full flex items-center justify-center pt-4 mb-4 relative'>
        <Image
          src='https://storage.googleapis.com/medieteknik-static/static/light_logobig.webp'
          alt='Company Logo'
          width='700'
          height='280'
          className='h-20 object-contain dark:hidden'
        />
        <Image
          src='https://storage.googleapis.com/medieteknik-static/static/dark_logobig.webp'
          alt='Company Logo'
          width='700'
          height='280'
          className='h-20 object-contain hidden dark:block'
        />

        <Button
          className='absolute right-8'
          title='Close'
          variant={'ghost'}
          size={'icon'}
          onClick={() => {
            saveCookieSettings({
              NECESSARY: true,
              FUNCTIONAL: sliders.FUNCTIONAL || false,
              ANALYTICS: sliders.ANALYTICS || false,
              PERFORMANCE: sliders.PERFORMANCE || false,
              ADVERTISING: sliders.ADVERTISING || false,
              THIRD_PARTY: sliders.THIRD_PARTY || false,
            })
          }}
        >
          <XMarkIcon className='w-8 h-8 ' />
        </Button>
      </div>
      <h1 className='text-center text-2xl px-8 py-4'>{t('consent')}</h1>
      <div className='px-8 flex flex-col gap-4 mb-8'>
        <p className='text-sm'>{t('privacyStatement')}</p>
        <div className='flex items-center gap-4'>
          <UserIcon className='w-10 h-10 p-2 bg-yellow-400/50 rounded-full' />
          <p className='text-sm w-full'>{t('personalized')}</p>
        </div>
        <div className='flex items-center gap-4'>
          <ComputerDesktopIcon className='w-10 h-10 p-2 bg-yellow-400/50 rounded-full' />
          <p className='text-sm w-full'>{t('store')}</p>
        </div>
      </div>
      <div className='w-full h-fit flex flex-col'>
        <div className='w-full h-fit flex flex-col gap-4 px-8'>
          <div className='w-full flex my-2 gap-4'>
            <Button variant={'outline'} asChild>
              <Link href='/privacy#policy'>{t('privacyPolicy')}</Link>
            </Button>
            <Button variant={'outline'} asChild>
              <Link href='/privacy#cookies'>{t('cookiePolicy')}</Link>
            </Button>
          </div>

          <div className='w-full flex gap-8'>
            <Button
              variant={'secondary'}
              className='w-1/2'
              onClick={() => {
                saveCookieSettings({
                  ...sliders,
                  FUNCTIONAL: sliders.FUNCTIONAL || false,
                  ANALYTICS: sliders.ANALYTICS || false,
                  PERFORMANCE: sliders.PERFORMANCE || false,
                  ADVERTISING: sliders.ADVERTISING || false,
                  NECESSARY: sliders.NECESSARY || true,
                  THIRD_PARTY: sliders.THIRD_PARTY || false,
                })
              }}
            >
              {t('btn_save')}
            </Button>
            <Button
              className='w-1/2'
              onClick={() => {
                const updatedSliders = {
                  FUNCTIONAL: true,
                  ANALYTICS: true,
                  PERFORMANCE: true,
                  ADVERTISING: true,
                  NECESSARY: true,
                  THIRD_PARTY: true,
                }
                setSliders(updatedSliders)
                saveCookieSettings(updatedSliders)
              }}
            >
              {t('btn_acceptAll')}
            </Button>
          </div>
        </div>
        <div className='max-h-96 overflow-y-auto px-8 py-8'>
          <div className='w-full h-full flex flex-col gap-4 pb-10'>
            {availableCookies.map((key, index) => {
              const cookie = key as
                | 'NECESSARY'
                | 'FUNCTIONAL'
                | 'ANALYTICS'
                | 'PERFORMANCE'
                | 'ADVERTISING'
                | 'THIRD_PARTY'
              return (
                <div
                  key={index}
                  className='w-full flex flex-col border-b-2 border-black/25 last:border-0'
                >
                  <div className='w-full flex justify-between'>
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
                        {t('cookie_' + cookie)}
                      </h3>
                    </div>
                    <div
                      className='cookieSwitch w-16 h-9 relative inline-block focus:border-2 focus:border-black'
                      onClick={() => {
                        updateSlider(cookie, !sliders[cookie])
                      }}
                    >
                      <Switch
                        checked={sliders[cookie]}
                        disabled={cookie === 'NECESSARY'}
                      />
                    </div>
                  </div>
                  {dropdowns[cookie] && (
                    <p className='px-8 mt-4 text-sm'>
                      {t('cookie_' + cookie + '_description')}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
