'use client'
import React from 'react'
import Image from 'next/image'
import Logo from '/public/images/logo.png'
import { UserCircleIcon } from '@heroicons/react/24/outline'

export default function LoginSection({
  params: { language },
}: {
  params: { language: string }
}) {
  const loggedIn: boolean = true
  const hasProfilePicture: boolean = false
  return (
    <section className='w-20 xl:w-1/6 relative h-full px-4 flex items-center justify-center xl:justify-between border-b-2 border-yellow-500 hover:bg-black/25 hover:cursor-pointer'>
      <div className='w-10/12 flex-col hidden relative xl:flex text-right justify-center items-end mr-2'>
        {loggedIn ? (
          <div
            className='w-full'
            title='Your Account'
            aria-label='Your Account Button'
          >
            <p className='sw-full text-sm max-w-full uppercase tracking-widest truncate'>
              André Eriksson
            </p>
            <p className='uppercase text-xs tracking-wider leading-tight '>
              Webmaster
            </p>
          </div>
        ) : (
          <p
            className='sw-full text-sm max-w-full uppercase tracking-widest'
            title='Login'
            aria-label='Login Button'
          >
            Log In
          </p>
        )}
      </div>

      <div className='w-10 h-10 relative'>
        {loggedIn ? (
          hasProfilePicture ? (
            <Image
              src={Logo.src}
              alt='Profile Picture'
              width='46'
              height='46'
              className='w-10 h-10 absolute object-cover'
            />
          ) : (
            <UserCircleIcon className='w-10 h-10 absolute text-yellow-400' />
          )
        ) : (
          <UserCircleIcon className='w-10 h-10 absolute' />
        )}
      </div>
    </section>
  )
}
