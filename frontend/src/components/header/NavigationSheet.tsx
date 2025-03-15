'use client'

import type { HeaderElement } from '@/components/header/util/HeaderElement'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { LanguageCode } from '@/models/Language'
import {
  Bars3CenterLeftIcon,
  Bars3Icon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useTheme } from 'next-themes'
import { Link } from 'next-view-transitions'
import Image from 'next/image'
import { type JSX, useCallback, useState } from 'react'
import './navigation.css'

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
  const [collasibleOpen, setCollapsibleOpen] = useState<boolean[]>(
    headerElements.map((element) => !!element.subNavs)
  )
  const { theme } = useTheme()

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
          className='w-full sm:w-fit h-full lg:hidden rounded-none'
          onClick={toggleMenu}
        >
          <Bars3CenterLeftIcon className='w-7 h-7 hidden sm:block' />
          <Bars3Icon className='w-7 h-7 sm:hidden' />
        </Button>
      </SheetTrigger>
      <SheetContent side={'left'} className='overflow-y-auto dark:bg-[#111]'>
        <SheetHeader>
          <SheetTitle>Navigation Menu</SheetTitle>
          <VisuallyHidden>
            <SheetDescription>Navigation Menu</SheetDescription>
          </VisuallyHidden>
        </SheetHeader>
        <nav className='w-full h-fit z-10 justify-between mt-4'>
          <ul className='space-y-3'>
            <li>
              <Link
                href={`/${language}`}
                className='block py-2 text-sm font-medium hover:text-primary'
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            {headerElements.map((element, index) => (
              <li key={element.title}>
                {element.subNavs ? (
                  <Collapsible>
                    <CollapsibleTrigger
                      className='flex w-full items-center justify-between py-2 text-sm font-medium'
                      onClick={() => {
                        setCollapsibleOpen((prev) => {
                          const newCollapsibleOpen = [...prev]
                          newCollapsibleOpen[index] = !newCollapsibleOpen[index]
                          return newCollapsibleOpen
                        })
                      }}
                    >
                      {element.title}
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform duration-300 ease-in-out ${collasibleOpen[index] ? 'rotate-180' : ''}`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className='collapsible-content overflow-hidden'>
                      <ul className='ml-4 mt-2 space-y-2 h-[90%]'>
                        {element.subNavs.map((subNav) => (
                          <li key={subNav.title}>
                            <Link
                              href={`/${language}${subNav.link}`}
                              className='text-sm text-muted-foreground hover:text-primary'
                              onClick={toggleMenu}
                            >
                              {subNav.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Link
                    href={`/${language}${element.link}`}
                    key={element.title}
                    className='block py-2 text-sm font-medium hover:text-primary'
                    onClick={toggleMenu}
                  >
                    {element.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <SheetFooter className='absolute bottom-4 left-0'>
          {theme === 'dark' ? (
            <Image
              src='https://storage.googleapis.com/medieteknik-static/static/dark_logobig.webp'
              alt='logo'
              width={512}
              height={512}
              className='w-full h-auto xxs:px-4 xs:px-8 hidden dark:block'
            />
          ) : (
            <Image
              src='https://storage.googleapis.com/medieteknik-static/static/light_logobig.webp'
              alt='logo'
              width={512}
              height={512}
              className='w-full h-auto xxs:px-4 xs:px-8 dark:hidden'
            />
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
