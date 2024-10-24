import { HeaderElement } from '@/components/header/util/HeaderElement'
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

import type { JSX } from 'react'

interface Props {
  language: string
  headerElements: HeaderElement[]
}

/**
 * @name NavigationMenu
 * @description Renders the navigation menu for smaller screens < 1024px
 *
 * @param {Props} props - The component props.
 * @param {string} props.language - The current language of the page.
 * @param {HeaderElement[]} props.headerElements - The elements in the header.
 * @returns {JSX.Element} The rendered navigation menu.
 */
export default function NavigationSheet({
  language,
  headerElements,
}: Props): JSX.Element {
  // TODO: Close the navigation menu when a link is clicked
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={'ghost'}
          className='w-fit h-full lg:hidden rounded-none'
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
          >
            <Link href={`/${language}`} className='w-full h-full text-start'>
              Home
            </Link>
          </Button>
          {headerElements.map((element, index) =>
            element.subNavs ? (
              <SubMenu element={element} key={index} />
            ) : (
              <Button
                key={element.title}
                variant={'secondary'}
                className='w-full h-fit uppercase flex justify-start items-center text-base xxs:text-xl'
              >
                <Link href={element.link} className='w-full h-full text-start'>
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
