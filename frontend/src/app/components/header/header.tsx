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

        <div className='w-1/2 h-full flex justify-end'>
          <ul className='w-1/2 flex justify-between items-center text-sm tracking-wide'>
            {HeaderNavElements.map((element, index) => {
              return (
                <li key={index} className='w-full h-full'>
                  <DropdownMenu params={element} />
                </li>
              )
            })}
          </ul>
          <div className='w-1/4 h-full flex justify-end items-center mx-8'>
            Logga In
          </div>
        </div>
      </div>
    </header>
    )
}