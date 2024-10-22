'use client'
import { useTranslation } from '@/app/i18n/client'
import { Switch } from '@/components/ui/switch'
import {
  COOKIE_CONSENT_STORAGE_KEY,
  CookieConsent,
  CookieSettings,
  DEFAULT_COOKIE_SETTINGS,
} from '@/utility/CookieManager'
import {
  ComputerDesktopIcon,
  MinusIcon,
  PlusIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from '../ui/button'
export default function DetailedCookiePopup({
  params: { language, popup },
}: {
  params: { language: string; popup: Dispatch<SetStateAction<boolean>> }
}) {
  const cookieTranslation = useTranslation(language, 'cookies').t
  const commonTranslation = useTranslation(language, 'common').t

  const [sliders, setSliders] = useState({
    ...DEFAULT_COOKIE_SETTINGS,
  })

  const [dropdowns, setDropdowns] = useState({
    NECESSARY: false,
    FUNCTIONAL: false,
    ANALYTICS: false,
    PERFORMANCE: false,
    ADVERTISING: false,
  })

  const updateSlider = (sliderName: CookieConsent, value: boolean) => {
    setSliders((prev) => ({
      ...prev,
      NECESSARY: true,
      [sliderName]: value,
    }))
  }

  const updateDropdowns = (dropdownName: CookieConsent, value: boolean) => {
    setDropdowns((prev) => ({
      ...prev,
      [dropdownName]: value,
    }))
  }

  async function saveCookieSettings(newSettings: CookieSettings) {
    popup(false)
    window.localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify(newSettings)
    )
  }

  const availableCookies: string[] = Object.values(CookieConsent)

  return (
    <div className='w-full lg:w-[750px] 2xl:w-[1000px] h-[800px] fixed top-28 rounded-3xl overflow-hidden bg-white dark:bg-[#111]'>
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
            })
          }}
        >
          <XMarkIcon className='w-8 h-8 ' />
        </Button>
      </div>
      <h1 className='text-center text-2xl px-8 py-4'>
        Medieteknik asks for your consent to use your personal data to:
      </h1>
      <div className='ml-8 flex flex-col gap-4 mb-8'>
        <div className='flex items-center gap-4'>
          <UserIcon className='w-10 h-10 p-2 bg-yellow-400/50 rounded-full' />
          <p className='text-sm w-9/12'>
            Personalised advertising and content, advertising and content
            measurement, audience research and services development
          </p>
        </div>
        <div className='flex items-center gap-4'>
          <ComputerDesktopIcon className='w-10 h-10 p-2 bg-yellow-400/50 rounded-full' />
          <p className='text-sm w-9/12'>
            Store and/or access information on a device
          </p>
        </div>
      </div>
      <div className='w-full h-[500px] px-8 overflow-y-scroll absolute flex flex-col'>
        <div className='w-full flex flex-col gap-4'>
          <div className='w-full flex my-2 gap-4'>
            <Button variant={'ghost'} asChild>
              <Link href='/privacy#policy'>
                {cookieTranslation('privacyPolicy')}
              </Link>
            </Button>
            <Button variant={'ghost'} asChild>
              <Link href='/privacy#cookies'>
                {cookieTranslation('cookiePolicy')}
              </Link>
            </Button>
          </div>

          <div className='w-full flex gap-8'>
            <Button
              variant={'outline'}
              className='w-1/2'
              onClick={() => {
                saveCookieSettings({
                  ...sliders,
                  FUNCTIONAL: sliders.FUNCTIONAL || false,
                  ANALYTICS: sliders.ANALYTICS || false,
                  PERFORMANCE: sliders.PERFORMANCE || false,
                  ADVERTISING: sliders.ADVERTISING || false,
                  NECESSARY: sliders.NECESSARY || true,
                })
              }}
            >
              {cookieTranslation('btn_save')}
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
                }
                setSliders(updatedSliders)
                saveCookieSettings(updatedSliders)
              }}
            >
              {cookieTranslation('btn_acceptAll')}
            </Button>
          </div>
        </div>
        <div className='w-full h-fit flex flex-col pb-10'>
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
                className='w-full flex flex-col mt-8 border-b-2 border-black/25 pb-4 last:border-0'
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
                    <Switch
                      checked={sliders[cookie]}
                      disabled={cookie === 'NECESSARY'}
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
