'use client'

import type { HeaderElement } from '@/components/header/util/HeaderElement'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Bars3CenterLeftIcon } from '@heroicons/react/24/outline'
import { Root } from '@radix-ui/react-visually-hidden'
import Image from 'next/image'
import Link from 'next/link'
import SubMenu from './client/SubMenu'

import type { LanguageCode } from '@/models/Language'
import { type JSX, useCallback, useState } from 'react'

interface Props {
  language: LanguageCode
  headerElements: HeaderElement[]
}

/**
 * @name NavigationMenu
 * @description Renders the navigation menu for smaller screens < 1024px
 *
 * @param {Props} props - The component props.
 * @param {string} props.language - The current language of the page.
 * @param {HeaderElement[]} props.headerElements - The elements in the header.
 *
 * @returns {JSX.Element} The rendered navigation menu.
 */
export default function NavigationSheet({
  language,
  headerElements,
}: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => {
      return !prev
    })
  }, [])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant={'ghost'}
          className='w-fit h-full lg:hidden rounded-none'
          onClick={toggleMenu}
        >
          <Bars3CenterLeftIcon className='w-7 h-7' />
        </Button>
      </SheetTrigger>
      <SheetContent side={'left'} className='overflow-y-auto dark:bg-[#111]'>
        <SheetHeader>
          <Root asChild>
            <SheetTitle>Navigation Menu</SheetTitle>
          </Root>
          <Image
            src='https://storage.googleapis.com/medieteknik-static/static/light_logobig.webp'
            alt='logo'
            width={512}
            height={512}
            className='w-full h-auto xxs:px-4 xs:px-8 dark:hidden'
          />
          <Image
            src='https://storage.googleapis.com/medieteknik-static/static/dark_logobig.webp'
            alt='logo'
            width={512}
            height={512}
            className='w-full h-auto xxs:px-4 xs:px-8 hidden dark:block'
          />
          <SheetDescription>Navigation Menu</SheetDescription>
        </SheetHeader>
        <nav className='w-full h-fit z-10 justify-between flex flex-col gap-2 mt-4'>
          <Button
            variant={'secondary'}
            className='w-full h-fit uppercase flex justify-start items-center text-base xxs:text-xl'
            asChild
            onClick={toggleMenu}
          >
            <Link href={`/${language}`} className='w-full h-full text-start'>
              Home
            </Link>
          </Button>
          {headerElements.map((element) =>
            element.subNavs ? (
              <SubMenu
                element={element}
                key={element.title}
                toggleMenuCallback={toggleMenu}
              />
            ) : (
              <Button
                key={element.title}
                variant={'secondary'}
                className='w-full h-fit uppercase flex justify-start items-center text-base xxs:text-xl'
                asChild
                onClick={toggleMenu}
              >
                <Link href={element.link} className='w-full h-fit text-start'>
                  {element.title}
                </Link>
              </Button>
            )
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
