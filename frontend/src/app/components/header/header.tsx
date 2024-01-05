import React from 'react';
import Image from 'next/image';
import Logo from '/public/images/logo.png';

export default function Header () {
  return (
    <header className='w-full bg-transparent text-white fixed'>
      <div className='w-full h-20 flex justify-between'>
        <div className='w-1/12 h-full flex justify-center items-center'>
          <a href='/' className='w-14'>
            <Image src={Logo.src} alt='Medieteknik Logo' width='56' height='56' />
          </a>
        </div>

        <div className='w-1/2 h-full flex justify-end'>
          <ul className='w-1/2 flex justify-between items-center text-sm tracking-wide '>
            <li>AKTUELLT</li>
            <li>SEKTIONEN</li>
            <li>UTBILDNING</li>
            <li>KONTAKT</li>
          </ul>
          <div className='w-1/4 h-full flex justify-end items-center mx-8'>
            Logga In
          </div>
        </div>
      </div>
    </header>
    )
}