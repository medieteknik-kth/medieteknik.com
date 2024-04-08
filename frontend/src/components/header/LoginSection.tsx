'use client'
import React from 'react'
import Image from 'next/image'
import Logo from '/public/images/logo.png'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/app/i18n/client'

import Link from 'next/link'

export default function LoginSection({
  params: { language, loggedIn },
}: {
  params: { language: string; loggedIn: boolean }
}) {
  const hasProfilePicture: boolean = false
  let username = 'André Eriksson'
  let role = 'Webmaster'

  const { t } = useTranslation(language, 'header')

  return (
    <Link
      href={loggedIn ? '/profile' : '/login'}
      className='w-20 xl:w-96 h-full text-sm uppercase flex justify-around items-center border-b-2 border-yellow-400 hover:bg-black/25'
      title={loggedIn ? t('profile') : t('login')}
      aria-label={loggedIn ? t('profile') : t('login')}
      aria-description={loggedIn ? t('profile') : t('login')}
    >
      <p className='w-4/5 text-end truncate flex-col tracking-wider hidden xl:flex'>
        {loggedIn ? username : t('login')}
        {loggedIn && <span className='text-xs text-cyan-400'>{role}</span>}
      </p>

      {loggedIn ? (
        hasProfilePicture ? (
          <Image
            src={Logo.src}
            alt='Profile Picture'
            width='40'
            height='40'
            loading='lazy'
          />
        ) : (
          <UserCircleIcon className='w-10 h-10' color='#FACC15' />
        )
      ) : (
        <UserCircleIcon className='w-10 h-10' />
      )}
    </Link>
  )
}
