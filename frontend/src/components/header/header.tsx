import React from 'react';
import Image from 'next/image';
import Logo from '/public/images/logo.png';
import { useTranslation } from '@/app/i18n'
import { Bars3CenterLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import NavigationMenu from './Navigation';

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
    <header className='w-full h-24 text-white fixed bg-transparent border-b-2 border-white/20'>
      <div className='w-full h-full flex justify-between'>
        <div className='w-fit h-full flex justify-between md:justify-start items-center'>
          <Link href='/' 
          className='w-full px-4 flex justify-center sm:justify-start items-center' 
          aria-label='Home Icon' title='KTH | Medieteknik'>
            <Image src={Logo.src} alt='Medieteknik Logo' width='46' height='46' /> 
          </Link>
        </div>
        
        <div className='w-1/2 h-full flex items-center justify-end'>
          <div className='w-2/3 h-full'>
            
          </div>


          <div className='w-1/3 h-full px-4 flex items-center justify-between border-l-2 border-black hover:bg-black/20 hover:cursor-pointer'>
            <div className='flex flex-col'>
              <p className='mr-3 uppercase max-w-80 tracking-widest truncate'>Viggo Halvarsson Skoog Andersson</p>
              <p className='uppercase text-xs tracking-wider leading-tight'>Valberedare</p>
            </div>
            <UserCircleIcon className='w-10 h-10' />
          </div>
        </div>
   
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