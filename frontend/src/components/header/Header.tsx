import React from 'react'
import Image from 'next/image'
import Logo from '/public/images/logo.png'
import { useTranslation } from '@/app/i18n'
import LoginSection from './LoginSection'

import Link from 'next/link'

type HeaderElement = {
  title: string
  link: string
}

export default async function Header({
  params: { language },
}: {
  params: { language: string }
}) {
  const { t } = await useTranslation(language, 'header')
  const common = (await useTranslation(language, 'common')).t
  const headerElements: HeaderElement[] = t('navs', { returnObjects: true })

  return (
    <header className='w-full h-24 text-white fixed bg-black/60 backdrop-blur z-20'>
      <div className='w-full h-full flex justify-between'>
        <div className='w-fit h-full flex justify-between items-center'>
          <Link
            href='/'
            className='w-20 h-full px-4 flex justify-center sm:justify-start items-center mr-8'
            aria-label='Home Button'
            role='button'
            title='Home'
          >
            <Image
              src={Logo.src}
              alt={common('title') + ` Logo`}
              width='46'
              height='46'
            />
          </Link>

          <div className='w-0 lg:w-fit h-full'>
            <ul className='w-full h-full hidden justify-between uppercase lg:flex tracking-widest text-sm'>
              {headerElements.map((element: HeaderElement, index: number) => {
                return (
                  <li key={index} className='w-fit h-full mx-2'>
                    <Link
                      href={element.link}
                      id={`nav-${index}`.toString()}
                      className='w-full h-full px-4 grid place-items-center border-b-2 border-transparent hover:border-yellow-400'
                      aria-label={element.title}
                      role='button'
                      title={element.title}
                    >
                      {element.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <LoginSection params={{ language }} />

        {/*<div className='w-20 sm:w-48 h-full grid place-items-center mr-8'>
          <NavigationMenu params={{ language }} />
        </div>
        {/*<div className='w-1/4 h-full flex justify-end items-center'>
          <ul className='w-full h-full flex justify-evenly items-center'>
            {headerElements.map((element: HeaderElement, index: number) => {
              return (
                <li key={index} className={listStyle}>
                  <NavItem title={element.title} metadata={{ link: element.link }} />
                </li>
              )
            })}
          </ul>
          <LoginSection params={{ language }}/>
        </div>*/}
      </div>
    </header>
  )
}
