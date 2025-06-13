'use client'

import { Button } from '@/components/ui/button'
import { useStudent } from '@/providers/AuthenticationProvider'
import { UserIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import type { JSX } from 'react'
import React from 'react'

export const ProfileButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>((props, ref): JSX.Element => {
  const { student } = useStudent()

  const username = student
    ? `${student.first_name} ${student.last_name || ''}`
    : ''
  return student ? (
    <Button
      className='w-full lg:w-72 xl:w-96 h-full flex relative justify-center md:justify-end items-center rounded-l-none rounded-r-md lg:gap-2'
      variant={'ghost'}
      ref={ref}
      {...props}
    >
      <div className='flex flex-col items-end'>
        <p className='text-base hidden lg:flex max-w-[248px] overflow-hidden'>
          {`${username.length > 28 ? `${username.slice(0, 28)}...` : username}`}
        </p>
        {student.reception_name && (
          <div className='items-center gap-1 hidden lg:flex' title='Reception'>
            <div className='bg-white p-0.5 rounded-full overflow-hidden'>
              <Image
                src='https://storage.googleapis.com/medieteknik-static/committees/mtgn.svg'
                unoptimized
                width={18}
                height={18}
                alt='reception icon'
                className='select-none'
              />
            </div>
            <p className='text-xs max-w-[248px] overflow-hidden text-muted-foreground'>
              {student.reception_name}
            </p>
          </div>
        )}
      </div>
      <div className='w-10 border border-white dark:border-black rounded-full bg-white overflow-hidden'>
        {student.profile_picture_url ? (
          <Image
            src={student.profile_picture_url}
            width={40}
            height={40}
            alt='Profile Picture'
            loading='lazy'
          />
        ) : (
          <div className='bg-primary text-black w-12 border border-white dark:border-black aspect-square rounded-full grid place-items-center font-semibold'>
            {`${student.first_name.charAt(0)}${student.last_name ? student.last_name.charAt(0) : ''}`}
          </div>
        )}
      </div>
    </Button>
  ) : (
    <Button
      className='w-full lg:w-72 xl:w-96 h-full flex relative justify-center md:justify-end items-center rounded-l-none rounded-r-md lg:gap-2'
      variant={'ghost'}
      ref={ref}
      {...props}
    >
      <p className='text-base hidden lg:flex max-w-[248px] overflow-hidden'>
        Logga in
      </p>
      <UserIcon className='w-7! h-7!' />
    </Button>
  )
})

ProfileButton.displayName = 'ProfileButton'
