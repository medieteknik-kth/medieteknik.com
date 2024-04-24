import React from 'react'

import LogoPNG from 'public/images/logo.png'
import { useTranslation } from '@/app/i18n'
import LoginSection from './LoginSection'
import NotificationHeader from './Notification'
import OptionsHeader from './Options'

import Link from 'next/link'
import Image from 'next/image'

/**
 * @interface HeaderElement
 * @description Header Element Interface, from translation file
 *
 * @property {string} title - The title of the header element
 * @property {string} link - The link of the header element
 */
export interface HeaderElement {
  title: string
  link: string
}

export default async function Header({
  params: { language },
}: {
  params: { language: string }
}) {
  const { t } = await useTranslation(language, 'header')
  const headerElements: HeaderElement[] = t('navs', { returnObjects: true })
  const loggedIn: boolean = true

  return (
    <header className='w-full h-24 text-white fixed bg-black/70 backdrop-blur-md flex justify-between z-50'>
      <div className='w-fit h-full flex z-20'>
        <Link
          href='/'
          className='w-20 max-w-20 px-4 h-full grid place-items-center z-10'
          title='Home'
          aria-label='Home Button'
        >
          <Image src={LogoPNG} alt='Logo' width={48} height={48} />
        </Link>
        <div className='w-fit h-full z-10'>
          <ul className='w-fit h-full hidden justify-between lg:flex'>
            {headerElements.map((element: HeaderElement, index: number) => {
              return (
                <li
                  key={index}
                  className='w-fit h-full grid place-items-center text-sm upper mx-2 uppercase tracking-wide z-10'
                >
                  <Link
                    href={element.link}
                    className='w-full h-full grid place-items-center border-b-2 border-transparent hover:border-yellow-400 px-4 hover:bg-black/25'
                    title={element.title}
                    aria-label={element.title}
                  >
                    {element.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <div className='w-fit flex z-10'>
        {loggedIn ? (
          <NotificationHeader params={{ language }} />
        ) : (
          <OptionsHeader params={{ language }} />
        )}

        <LoginSection params={{ language, loggedIn }} />
      </div>
    </header>
  )
}
