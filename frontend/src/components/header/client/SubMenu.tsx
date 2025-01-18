'use client'

import type { HeaderElement } from '@/components/header/util/HeaderElement'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { type JSX, useState } from 'react'

interface Props {
  element: HeaderElement
  toggleMenuCallback: () => void
}

/**
 * @name SubMenu
 * @description Renders a sub menu for navigation elements with sub elements
 *
 * @param {Props} props
 * @param {HeaderElement} props.element - The element to render
 *
 * @returns {JSX.Element} The rendered sub menu
 * @throws {Error} If the element does not have subNavs
 */
export default function SubMenu({
  element,
  toggleMenuCallback,
}: Props): JSX.Element {
  if (!element.subNavs) {
    throw new Error('Element must have subNavs')
  }

  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div key={element.title} className='rounded-md'>
      <Button
        variant={'secondary'}
        className={`w-full h-full uppercase rounded-t-md flex justify-start items-center text-base xxs:text-xl transition-none ${
          isOpen ? 'rounded-b-none bg-accent' : 'rounded-b-md'
        }`}
        onClick={() => {
          setIsOpen((prev) => {
            return !prev
          })
        }}
      >
        {element.title}
        <ChevronDownIcon
          className={`w-5 h-5 ml-2 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </Button>
      <nav
        className={`w-full h-full bg-accent rounded-b-md flex flex-col gap-2 pb-4 ${
          isOpen ? 'block' : 'hidden'
        } `}
      >
        {element.subNavs.map((subNav) => (
          <div key={subNav.title}>
            <Button
              variant={'outline'}
              className='w-10/12 h-fit uppercase flex justify-start items-center ml-4 py-4 bg-neutral-50 dark:bg-neutral-900'
              onClick={toggleMenuCallback}
              asChild
            >
              <Link key={subNav.title} href={subNav.link} className='text-wrap'>
                {subNav.title}
              </Link>
            </Button>
          </div>
        ))}
      </nav>
    </div>
  )
}
