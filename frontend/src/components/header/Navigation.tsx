'use client'
import Link from 'next/link';
import { useState } from 'react';
import { Bars3CenterLeftIcon, XMarkIcon, ChevronDownIcon, UserCircleIcon, CogIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/app/i18n/client';

function LoginSection() {
  const [showLogin, setShowLogin] = useState(false)

  const toggleLogin = () => {
    setShowLogin(!showLogin)
  }
  return (
    <section className='h-96 w-full z-40'>
      <div className='w-full h-fit border-b-2 border-yellow-500 p-4 flex justify-between items-center' onClick={toggleLogin}>
        <p>LOGIN</p>
        <ChevronDownIcon className='w-6 h-6' />
      </div>
      {/*<form className='w-2/3 absolute top-0 -z-10 text-black'>
        <input type='email'></input>
        <input type='password'></input>
        <button type='submit'>LOGIN</button>
      </form>*/}
    </section>
  )
}

function UserDetailsSection() {
  return (
    <section className='w-full h-32 fixed bottom-0 flex justify-between items-center border-t-2 border-yellow-500'>
      <div className='w-1/2 flex items-center'>
        <div>
          <UserCircleIcon className='w-16 h-16' />
        </div>
        <div className='ml-4'>
          <p>John Doe</p>
        </div>
      </div>
      <div className='w-1/3 flex items-center justify-end mr-8'>
        <CogIcon className='w-8 h-8' />
        <ArrowRightStartOnRectangleIcon className='w-8 h-8 text-red-400' />
      </div>
    </section>
  )
}

export default function NavigationMenu({ params: { language } }: { params: { language: string }}) {
  const [showMenu, setShowMenu] = useState(false)
  const { t } = useTranslation(language, 'header')

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div 
      className='w-full h-1/2 flex justify-center items-center py-6 border-2 border-white/10 rounded-3xl mr-8 hover:cursor-pointer bg-white/5' 
      onClick={toggleMenu} 
      aria-label='Navigation Menu' title='Navigation Menu'>
        <p className='mr-6 hidden sm:block'>{t('menu')}</p>
        <Bars3CenterLeftIcon className='w-9 h-9 rotate-180' /> 
      </div>
      <div className={`w-[512px] ${showMenu ? 'translate-x-0' : 'translate-x-full'} h-screen fixed top-0 right-0 z-50 bg-gray-900 transition-all ease-in`} onMouseLeave={() => {setShowMenu(false)}}>
        <div className='h-24 w-full flex items-center justify-end hover:cursor-pointer' onClick={toggleMenu}>
          <p className='text-base mr-2'>CLOSE</p>
          <XMarkIcon className='w-9 h-9 mr-8' />
        </div>
        <LoginSection />
        <UserDetailsSection />
      </div>
    </div>
    
  )
}