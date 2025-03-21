import type { HeaderElement } from '@/components/header/util/HeaderElement'
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import type { LanguageCode } from '@/models/Language'
import { Link } from 'next-view-transitions'
import Image from 'next/image'
import type { JSX } from 'react'

interface Props {
  language: LanguageCode
  headerElement: HeaderElement
}

/**
 * @name MegaMenu
 * @description Renders the mega menu for the navigation menu
 *
 * @param {Props} props
 * @param {HeaderElement} props.headerElement - The element to render
 * @returns {Promise<JSX.Element[]>} The rendered mega menu
 */
export default async function MegaMenu({
  language,
  headerElement,
}: Props): Promise<JSX.Element[]> {
  if (!headerElement.subNavs) {
    throw new Error('Element must have subNavs')
  }

  return headerElement.subNavs.map((subNav) =>
    subNav.icon ? (
      <li
        key={subNav.title}
        className='w-full row-span-1 lg:row-span-full col-span-2 lg:col-span-1'
      >
        <NavigationMenuLink asChild>
          <Link
            href={`/${language}${subNav.link}`}
            className={`${navigationMenuTriggerStyle()} w-full! flex lg:flex-col gap-4 items-center h-full`}
          >
            <div className='p-1 bg-white w-16 h-16 grid place-items-center rounded-full overflow-hidden'>
              <Image
                src={subNav.icon}
                unoptimized // Logos are SVGs, so they don't need to be optimized
                width={54}
                height={54}
                alt={subNav.title}
              />
            </div>
            <div className='flex flex-col items-start lg:items-center justify-center h-fit'>
              <p>{subNav.title}</p>
              <p className='text-xs lg:text-center text-neutral-600 dark:text-neutral-400 max-w-40'>
                {subNav.description ? subNav.description : ''}
              </p>
            </div>
          </Link>
        </NavigationMenuLink>
      </li>
    ) : (
      <li key={subNav.title} className='w-full h-16'>
        <NavigationMenuLink asChild>
          <Link
            href={`/${language}${subNav.link}`}
            className={`${navigationMenuTriggerStyle()} w-full! flex flex-col text-sm items-start! justify-center h-full`}
          >
            <p>{subNav.title}</p>
            <p className='text-xs text-neutral-600 dark:text-neutral-400'>
              {subNav.description ? subNav.description : ''}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  )
}
