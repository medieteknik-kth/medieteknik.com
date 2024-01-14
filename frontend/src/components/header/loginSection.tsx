'use client'
import '/node_modules/flag-icons/css/flag-icons.min.css';
import Link from 'next/link'
import React from 'react'
import { NavItem, BaseNavItem, AllowedEventTypes } from './Navigation';
import { useState } from 'react'
import { UserCircleIcon, EllipsisVerticalIcon, SunIcon, MoonIcon, LanguageIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/app/i18n/client';


function Settings({ params: { language } }: { params: { language: string } }) {
  const { t } = useTranslation(language, 'header')
  const settingElements: {title: string}[] = t('settings', { returnObjects: true })

  const SettingElements: BaseNavItem[] = [
    {
      title: (settingElements[0].title),
      metadata: {
        icon: SunIcon
      }
    },
    {
      title: (settingElements[1].title),
      metadata: {
        icon: LanguageIcon
      },
      event: {
        type: AllowedEventTypes.click,
        callback: () => toggleLanguage()
      }
    },
    {
      title: (settingElements[2].title),
      metadata: {
        link: '/settings',
        icon: Cog6ToothIcon
      }
    }
  ]

  const [showSettings, setShowSettings] = useState(false)
  const [showLanguage, setShowLanguage] = useState(false)

  function toggleSettings(): void {
    setShowSettings(!showSettings)
  }

  function toggleLanguage(): void {
    setShowLanguage(!showLanguage)
  }

  return (
    <div>
      <EllipsisVerticalIcon className='w-9 mx-8 hover:cursor-pointer' onMouseDown={toggleSettings}/>
      {showSettings &&
        (
          <div className={`w-1/12 h-[12rem] absolute flex flex-col top-16 bg-stone-800`}>
            <ul className='w-full h-full'>
              {SettingElements.map((element: BaseNavItem, index: number) => {
                return (
                  <li key={index} className='h-1/3 flex items-center cursor-pointer'>
                    <NavItem title={element.title} metadata={element.metadata} event={element.event} />
                  </li>
                )
              })}
            </ul>
          </div>
        )
      }
      {showLanguage && (
        <div 
        className='w-full h-dvh absolute top-0 left-0 flex items-center bg-black/50' 
        onMouseDown={toggleLanguage}>
          <ul 
          className='w-1/12 h-1/6 m-auto bg-stone-800 z-10' 
          onMouseDown={(event) => {event.stopPropagation()}}>
            <li className='w-full h-1/3 flex justify-center items-center border-b-2 border-black/50'>
              <h2 className='font-bold'>{t('toggleLanguage')}</h2>
            </li>
            <li className='w-full h-1/3'>
              <Link href='/en' className='w-full h-full'>
                <p className='w-full h-full flex justify-start items-center'><span className='fi fi-gb mx-8'></span>English</p>
              </Link>
            </li>
            <li className='w-full h-1/3'>
              <Link href='/sv' className='w-full h-full'>
                <p className='w-full h-full flex justify-start items-center'><span className='fi fi-se mx-8'></span>Svenska</p>
              </Link>
            
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

function LoggedIn({ params: { language } }: { params: { language: string } }): JSX.Element {
  return (
    <div>
      {//TODO: Implement 
      }
    </div>
  )
}

function Guest({ params: { language } }: { params: { language: string } }): JSX.Element {

  return (
    <div className='w-full h-full flex justify-end items-center'>
      <Settings params={{language}} />
      <Link href={'/login'} className='w-1/2 h-full flex justify-end items-center'>
        <p className='mr-4'>Login</p>
        <UserCircleIcon className='w-9' />
      </Link>
    </div>
    
  )
}

export default function LoginSection({ params: { language } }: { params: { language: string } }) {
  const loggedIn: boolean = false
  return (
    <div className='w-1/4 h-full flex justify-end items-center mx-8'>
      {loggedIn ? <LoggedIn params={{language}} /> : <Guest params={{language}} />}
    </div>
  )
}