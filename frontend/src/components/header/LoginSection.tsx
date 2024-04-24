'use client'
import React, { useState } from 'react'
import { TFunction } from 'next-i18next'
import Image from 'next/image'
import Logo from '/public/images/logo.png'
import {
  UserCircleIcon,
  Cog6ToothIcon,
  LifebuoyIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useTranslation } from '@/app/i18n/client'
import Link from 'next/link'
import { HeaderElement } from './Header'

function UserLoggedIn({ params }: { params: { t: TFunction } }) {
  const { t } = params
  const profileElements: HeaderElement[] = t('profileNavs', {
    returnObjects: true,
  })

  const iconMap = (link: string) => {
    switch (link) {
      case '/profile':
        return <UserIcon className='w-6 h-6 mx-2' />
      case '/account':
        return <Cog6ToothIcon className='w-6 h-6 mx-2' />
      case '/logout':
        return <XMarkIcon className='w-6 h-6 mx-2' />
      default:
        return <UserIcon className='w-6 h-6 mx-2' />
    }
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  let hasProfilePicture: boolean = false
  let username = 'André Eriksson'
  let role = 'Webmaster'
  return (
    <div className='w-full h-full relative'>
      <div
        className={`w-screen h-screen ${
          isMenuOpen ? 'block' : 'hidden'
        } fixed -z-50 left-0 top-0`}
        onClick={() => setIsMenuOpen(false)}
      />
      <button
        className='w-full h-full text-sm uppercase flex justify-around items-center border-b-2 border-yellow-400 hover:bg-black/25 z-10'
        onClick={() => {
          setIsMenuOpen(!isMenuOpen)
        }}
      >
        <p className='w-4/5 text-end truncate flex-col tracking-wider hidden xl:flex'>
          {username}
          {role && <span className='text-xs text-cyan-400'>{role}</span>}
        </p>

        {hasProfilePicture ? (
          <Image
            src={Logo.src}
            alt='Profile Picture'
            width='40'
            height='40'
            loading='lazy'
          />
        ) : (
          <UserCircleIcon className='w-10 h-10' color='#FACC15' />
        )}
      </button>
      <div
        className={`min-w-60 w-1/2 md:w-96 h-fit flex-col bg-white absolute border-2 text-black border-gray-300 border-t-0 ${
          isMenuOpen ? 'flex' : 'hidden'
        } top-24 right-0 z-50`}
        role='dialog'
      >
        <ul className='w-full h-fit flex flex-col items-center px-10'>
          {profileElements.map((element, index) => (
            <li
              key={index}
              className='w-full h-fit flex items-center justify-center border-b-2 border-yellow-400 my-4'
            >
              <Link
                href={element.link}
                className='w-full h-full py-4 flex items-center hover:bg-black/15 uppercase tracking-wider'
                title={element.title}
                aria-label={element.title}
              >
                {iconMap(element.link)}
                <p>{element.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Guest({ params }: { params: { t: TFunction } }) {
  const { t } = params
  return (
    <Link
      href='/login'
      className='w-full h-full text-sm uppercase flex justify-around items-center border-b-2 border-yellow-400 hover:bg-black/25 z-10'
      title={t('login')}
      aria-label={t('login')}
    >
      <p className='w-4/5 text-end truncate flex-col tracking-wider hidden xl:flex'>
        {t('login')}
      </p>
      <UserCircleIcon className='w-10 h-10' />
    </Link>
  )
}

export default function LoginSection({
  params: { language, loggedIn },
}: {
  params: { language: string; loggedIn: boolean }
}) {
  const { t } = useTranslation(language, 'header')

  return (
    <div className='w-20 xl:w-96 h-full'>
      {loggedIn ? <UserLoggedIn params={{ t }} /> : <Guest params={{ t }} />}
    </div>
  )
}
