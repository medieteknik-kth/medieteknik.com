'use client'
import React from 'react'
import { useState } from 'react'

// 'Språk',
//  'Tema',
//  'Inställningar'
const Settings =
[
  'Språk',
  'Tema',
  'Inställningar'
]

const SettingsElements = [{
  name: 'Språk',
  link: '/language'
},
{
  name: 'Tema',
  link: '/theme'
},
{
  name: 'Inställningar',
  link: '/settings'
}]

export default function LoginSection() {
  const [open, setOpen] = useState(false)

  const toggleOpen = () => {
    setOpen(!open)
  }

  const close = () => {
    setOpen(false)
  }

  return (
    <div className='w-1/4 h-full flex justify-end items-center mx-8'>
      <div onMouseDown={toggleOpen} onMouseLeave={close}>
      <svg className='w-8 mx-4 hover:cursor-pointer' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M12 12H12.01M12 6H12.01M12 18H12.01M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12ZM13 18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18C11 17.4477 11.4477 17 12 17C12.5523 17 13 17.4477 13 18ZM13 6C13 6.55228 12.5523 7 12 7C11.4477 7 11 6.55228 11 6C11 5.44772 11.4477 5 12 5C12.5523 5 13 5.44772 13 6Z' stroke='#ffffff' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
      </svg>
        {open && (
          <div className='w-60 h-64 bg-stone-900 text-white absolute top-14 right-20'>
            {Settings.map((element, index) => (
              <div key={index} className='w-full h-16 pl-4 flex items-center justify-start hover:bg-stone-800'>
                {element}
              </div>
            ))}
          </div>
        )}
      </div>
      <a href='/login' className='h-full flex items-center'>
        <p className='mr-4 text-sm font-semibold tracking-wide'>&nbsp;&nbsp; LOGGA IN</p>
        <svg className='w-10' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z' stroke='#ffffff' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
        </svg>
      </a>
    </div>
  )
}