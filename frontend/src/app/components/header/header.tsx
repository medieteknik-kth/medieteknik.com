import React from 'react';
import Image from 'next/image';
import Logo from '/public/images/logo.png';
import DropdownMenu from '../menu/dropdown';
import { DropdownBlueprint } from '../menu/dropdown';

const HeaderNavElements: DropdownBlueprint[] = [
  {
    title: 'AKTUELLT',
    navmenu: [
      {
        title: 'Nyheter',
        url: '/nyheter'
      },
      {
        title: 'Event',
        url: '/event'
      },
      {
        title: 'Podcast',
        url: '/podcast'
      }
    ]
  },
  {
    title: 'SEKTIONEN',
    navmenu: [
      {
        title: 'Styrelsen',
        url: '/styrelsen'
      },
      {
        title: 'Kommittéer',
        url: '/kommittéer'
      },
      {
        title: 'Stadgar',
        url: '/stadgar'
      },
      {
        title: 'Dokument',
        url: '/dokument'
      }
    ]
  },
  {
    title: 'UTBILDNING',
    navmenu: [
      {
        title: 'Vad är Medieteknik?',
        url: '/vad-ar-medieteknik'
      },
      {
        title: 'Kurser',
        url: '/kurser'
      }
    ]
  },
  {
    title: 'KONTAKT',
    navmenu: [
      {
        title: 'Kontakta oss',
        url: '/kontakta-oss'
      },
      {
        title: 'Företag',
        url: '/foretag'
      }
    ]
  }
]

export default function Header () {
  return (
    <header className='w-full bg-transparent text-white fixed'>
      <div className='w-full h-20 flex justify-between'>
        <div className='w-1/12 h-full flex justify-center items-center ml-8'>
          <a href='/' className='w-96 flex justify-around items-center'>
            <Image src={Logo.src} alt='Medieteknik Logo' width='46' height='46' />
            <h1 className='text-xl font-bold'>Medieteknik</h1>
          </a>
        </div>

        <div className='w-1/2 h-full flex justify-end items-center'>
          <ul className='w-1/2 h-full flex justify-between items-center text-sm tracking-wide'>
            {HeaderNavElements.map((element, index) => {
              return (
                <li key={index} className='w-full h-full'>
                  <DropdownMenu params={element} />
                </li>
              )
            })}
            
          </ul>
          <div className='w-1/4 h-full flex justify-end items-center mx-8'>
            <a href='/login' className='h-full flex items-center'>
              <p className='mr-4 text-sm font-semibold tracking-wide'>&nbsp;&nbsp; LOGGA IN</p>
              <svg className='w-10' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </a>
          </div>
        </div>
      </div>
    </header>
    )
}