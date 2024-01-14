import React from 'react';
import Image from 'next/image';
import Logo from '/public/images/logo.png';
import { NavItem } from './Navigation';
import LoginSection from './LoginSection';
import { useTranslation } from '@/app/i18n'

type HeaderElement = {
  title: string,
  link: string
}

const listStyle = 'w-40 h-full flex justify-center items-center border-b-2 border-transparent hover:bg-stone-800/20 hover:border-yellow-500'

export default async function Header ({ params: { language } }: { params: { language: string } }) {
  const { t } = await useTranslation(language, 'header')
  const headerElements: HeaderElement[] = t('navs', { returnObjects: true }); 

  return (
    <header className='w-full bg-transparent text-white fixed'>
      <div className='w-full h-20 flex justify-between'>
        <div className='w-[10%] h-full flex justify-center items-center ml-8'>
          <a href='/' className='w-96 flex justify-around items-center'>
            <Image src={Logo.src} alt='Medieteknik Logo' width='46' height='46' />
            <h1 className='text-xl font-bold'>{t('title')}</h1>
          </a>
        </div>

        <div className='w-1/2 h-full flex justify-end items-center'>
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
        </div>
      </div>
    </header>
    )
}