import React from 'react';
import Image from 'next/image';
import Logo from '/public/images/logo.png';
import { NavItem } from './Navigation';
import LoginSection from './LoginSection';
import { useTranslation } from '@/app/i18n'
import { Bars3CenterLeftIcon } from '@heroicons/react/24/outline';

import Link from 'next/link';

type HeaderElement = {
  title: string,
  link: string
}

const listStyle = 'w-40 h-full flex justify-center items-center border-b-2 border-transparent hover:bg-stone-800/20 hover:border-yellow-500'

export default async function Header ({ params: { language } }: { params: { language: string } }) {
  const { t } = await useTranslation(language, 'header')
  const headerElements: HeaderElement[] = t('navs', { returnObjects: true }); 

  return (
    <header className='w-screen text-white fixed bg-transparent'>
      <div className='w-full h-20 flex justify-between'>
        <div className='w-20 sm:w-1/2 h-full flex justify-between md:justify-start items-center ml-8'>
          <Link href='/' className='w-full flex justify-center sm:justify-start items-center'>
            <Image src={Logo.src} alt='Medieteknik Logo' width='46' height='46' />  
            <h1 className='ml-8 text-xl font-bold hidden sm:block'>{t('title')}</h1>
          </Link>
        </div>
        <div className=' hidden xs:grid place-items-center sm:hidden'>
          <h1 className='text-xl font-bold'>{t('title')}</h1>
        </div>
        <div className='w-20 sm:w-48 h-full grid place-items-center mr-8'>
          <div className='w-full h-1/2 flex justify-center items-center py-6 border-2 border-white/10 rounded-3xl mr-8 hover:cursor-pointer bg-white/5'>
            <p className='mr-6 hidden sm:block'>{t('menu')}</p>
            <Bars3CenterLeftIcon className='w-9 h-9 rotate-180' />
          </div>
          
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