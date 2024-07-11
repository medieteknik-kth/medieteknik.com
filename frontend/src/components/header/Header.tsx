import React from 'react'
import Logo from 'public/images/logo.webp'
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

export default async function Header({ language }: { language: string }) {
  const { t } = await useTranslation(language, 'header')
  const headerElements: HeaderElement[] = t('navs', { returnObjects: true })

  return (
    <header className='w-full h-24 text-white fixed bg-black/70 backdrop-blur-md flex justify-between z-50'>
      <div className='w-fit h-full flex z-20'>
        <Link
          href={'/' + language}
          className='w-20 max-w-20 px-4 h-full grid place-items-center z-10'
          title='Home'
          aria-label='Home Button'
        >
          <Image src={Logo} alt='Logo' width={48} height={48} loading='lazy' />
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
                    href={'.' + element.link}
                    className='w-full h-full grid place-items-center px-4 hover:bg-white/25 hover:text-white border-b-2 border-transparent hover:border-yellow-400 rounded-none'
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
        <LoginSection language={language} />
      </div>
    </header>
  )
}
