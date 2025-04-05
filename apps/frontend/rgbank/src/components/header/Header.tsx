import AuthenticatedNavigation from '@/components/header/client/AuthenticatedNavigation'
import ProfileMenu from '@/components/header/client/ProfileMenu'
import { Button } from '@/components/ui/button'
import type { LanguageCode } from '@/models/Language'
import { Link } from 'next-view-transitions'
import Image from 'next/image'
import Logo from 'public/images/logo.webp'
import type { JSX } from 'react'

interface Props {
  language: LanguageCode
}

/**
 * @name Header
 * @description Renders the main header of all pages, with a logo and navigation
 *
 * @param {Props} props
 * @param {string} props.language - The current language of the page
 *
 * @returns {Promise<JSX.Element>} - The header of the page
 */
export default function Header({ language }: Props): JSX.Element {
  return (
    <header
      id='header'
      className='left-2 right-2 bottom-2 md:left-5 md:right-5 md:top-5 rounded-md h-16 lg:h-24 bg-white dark:bg-[#111] fixed grid md:flex lg:grid grid-rows-1 grid-cols-5 md:grid-cols-2 justify-between place-items-center z-50 transition-all border dark:border-yellow-400 shadow-md'
    >
      <div className='hidden md:flex h-full place-self-start'>
        <Button
          variant={'ghost'}
          asChild
          className='h-full items-center justify-center'
        >
          <Link href={`/${language}?template=select`}>
            <Image
              src={Logo.src}
              alt='Medieteknik Logo'
              width={64}
              height={64}
              className='object-cover h-10 w-auto lg:h-16'
              priority
              sizes='(max-width: 768px) 64px, (max-width: 1200px) 128px, 256px'
            />
          </Link>
        </Button>

        <AuthenticatedNavigation language={language} />

        <Button
          variant={'ghost'}
          asChild
          className='uppercase h-full bg-inherit'
        >
          <Link href={`/${language}/statistics`}>Statistics</Link>
        </Button>

        <Button
          variant={'ghost'}
          asChild
          className='uppercase h-full bg-inherit'
        >
          <Link href={`/${language}/admin`}>Admin</Link>
        </Button>
      </div>

      <div className='place-self-end h-full'>
        <ProfileMenu />
      </div>
    </header>
  )
}
