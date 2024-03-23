'use client'
import React from 'react'
import Image from 'next/image'
import Logo from '/public/images/logo.png'
import { UserCircleIcon } from '@heroicons/react/24/outline'

import Link from 'next/link'

export default function LoginSection({
  params: { language },
}: {
  params: { language: string }
}) {
  const loggedIn: boolean = false
  const hasProfilePicture: boolean = false
  return (
    <section className='w-20 xl:w-1/6 relative h-full px-4 flex items-center justify-center xl:justify-end border-b-2 border-yellow-500 hover:bg-black/25 hover:cursor-pointer'>
      {loggedIn ? (
        <div></div>
      ) : (
        <Link
          href={'./login'}
          className='w-full h-full flex justify-end items-center relative'
          title='Login'
          aria-label='Login Button'
        >
          <p className='w-full text-right absolute right-16 text-sm tracking-widest uppercase'>
            Log In
          </p>
          <UserCircleIcon className='w-10 h-10 absolute' />
        </Link>
      )}
      {/*<div className='w-10/12 h-full flex flex-col relative xl:flex text-right justify-center items-end mr-2'>
        {/*loggedIn ? (
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
          <Link
            href={'/login'}
            className='w-full h-full absolute left-0 mr-20 text-sm max-w-full flex items-center justify-end uppercase tracking-widest z-10'
            title='Login'
            aria-label='Login Button'
          >
            Log In
          </Link>
        )}
      </div>*/}

      {/*<div className='w-10 h-10 relative right-0'>
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
        </div>*/}
    </section>
  )
}
