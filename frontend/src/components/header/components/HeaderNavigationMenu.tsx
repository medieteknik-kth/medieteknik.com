import { HeaderElement } from '@/components/header/util/HeaderElement'
import MegaMenu from '@/components/header/view/MegaMenu'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import './headerNavigationMenu.css'

import type { JSX } from 'react'

interface Props {
  headerElements: HeaderElement[]
}

/**
 * @name HeaderNavigationMenu
 * @description Renders the navigation menu for larger screens > 1024px
 *
 * @param {Props} props
 * @param {HeaderElement[]} props.headerElements - The elements in the header.
 * @returns {Promise<JSX.Element>} The rendered navigation menu.
 */
export default async function HeaderNavigationMenu({
  headerElements,
}: Props): Promise<JSX.Element> {
  return (
    <nav className='w-fit h-full *:h-full z-10 hidden justify-between lg:flex gap-2 *:tracking-wide'>
      {headerElements.map((element) =>
        element.subNavs ? (
          <NavigationMenu key={element.title} className='*:h-full'>
            <NavigationMenuList className='!h-full'>
              <NavigationMenuItem className='h-full'>
                <NavigationMenuTrigger className='uppercase h-full bg-inherit'>
                  {element.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent className='px-2 py-2'>
                  <ul className='content w-[800px] h-fit grid grid-rows-3'>
                    <MegaMenu headerElement={element} />
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ) : (
          <Button key={element.title} variant={'ghost'} asChild>
            <Link
              href={element.link}
              className='w-fit min-w-28 h-full grid place-items-center uppercase rounded-none'
            >
              {element.title}
            </Link>
          </Button>
        )
      )}
    </nav>
  )
}
