import React from 'react'
import Logo from 'public/images/logo.webp'
import { useTranslation } from '@/app/i18n'
import LoginSection from './client/LoginSection'
import Link from 'next/link'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import NavigationMenu from './NavigationMenu'

/**
 * HeaderElement
 *
 * @description An element in the header, with the title and the link to the page from the translation files
 * @property {string} title - The title of the element
 * @property {string} link - The link to the element
 */
export interface HeaderElement {
  title: string
  link: string
  subNavs?: HeaderElement[]
}

/**
 * Header
 * @description Renders the main header of all pages, with a logo and navigation
 *
 * @param {string} language - The current language of the page
 * @returns {Promise<JSX.Element>} - The header of the page
 */
export default async function Header({
  language,
}: {
  language: string
}): Promise<JSX.Element> {
  const { t } = await useTranslation(language, 'header')
  const headerElements: HeaderElement[] = t('navs', { returnObjects: true })

  return (
    <header
      id='header'
      className='w-full h-24 text-black bg-white dark:bg-[#111] dark:text-white fixed backdrop-blur-md flex justify-between z-50 transition-all shadow-md dark:shadow-neutral-900'
    >
      <div className='w-fit h-full flex z-20'>
        <Button variant={'ghost'} className='w-fit h-full hidden lg:block'>
          <Link
            href={'/' + language}
            className='w-fit h-full flex items-center z-10 relative'
            title='Home'
            aria-label='Home Button'
          >
            <Image
              src={Logo.src}
              alt='placeholder'
              width={128}
              height={128}
              className='w-auto h-full py-3'
            />
          </Link>
        </Button>
        <NavigationMenu language={language} headerElements={headerElements} />
        <nav className='w-fit h-full z-10 hidden justify-between lg:flex gap-2'>
          {headerElements.map((element) =>
            element.subNavs ? (
              <DropdownMenu key={element.title} modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={'ghost'}
                    className='w-40 h-full uppercase rounded-none'
                  >
                    {element.title}
                    <ChevronDownIcon className='w-5 h-5 ml-2' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-52'>
                  {element.subNavs.map((subNav) => (
                    <DropdownMenuItem
                      key={subNav.title}
                      className='min-h-10 h-fit hover:bg-neutral-100 border-l-2 border-transparent hover:border-yellow-400 rounded-l-none'
                    >
                      <Link
                        href={subNav.link}
                        className='w-full h-full grid items-center'
                      >
                        {subNav.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                key={element.title}
                variant={'ghost'}
                className='w-40 h-full uppercase rounded-none'
              >
                <Link
                  href={element.link}
                  className='w-full h-full grid place-items-center'
                >
                  {element.title}
                </Link>
              </Button>
            )
          )}
        </nav>
      </div>
      <div className='w-fit flex z-10'>
        <LoginSection language={language} />
      </div>
    </header>
  )
}
