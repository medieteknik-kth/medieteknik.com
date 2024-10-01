'use client'
import { useState, Dispatch, SetStateAction } from 'react'
import { ClientCookieConsent, CookieConsent } from '@/utility/CookieManager'
import {
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  UserIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline'
import { useTranslation } from '@/app/i18n/client'
import Logo from '/public/images/logo.webp'
import Link from 'next/link'
import Image from 'next/image'
import { Switch } from '@/components/ui/switch'
import { Button } from '../ui/button'

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

  const previousCookies = new ClientCookieConsent(
    window
  ).retrieveCookieSettings()

  const [sliders, setSliders] = useState({
    ...previousCookies,
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
    <div className='w-full lg:w-1/2 2xl:w-1/4 h-[800px] fixed top-20 rounded-3xl overflow-hidden bg-white dark:bg-[#111]'>
      <div className='w-full flex items-center pt-4 mb-4 pl-8'>
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

        <button
          className='w-8 h-8 ml-auto mr-8'
          title='Close'
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
        </button>
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
                return sliders
              }}
            >
              {cookieTranslation('btn_save')}
            </Button>
            <Button
              className='w-1/2'
              onClick={() => {
                setSliders((prev) => {
                  const updatedSliders = {
                    ...prev,
                    FUNCTIONAL: true,
                    ANALYTICS: true,
                    PERFORMANCE: true,
                    ADVERTISING: true,
                    NECESSARY: true,
                  }
                  saveCookieSettings(updatedSliders)
                  return updatedSliders
                })
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
