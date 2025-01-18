import type { HeaderElement } from '@/components/header/util/HeaderElement'
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import type { LanguageCode } from '@/models/Language'
import Image from 'next/image'
import Link from 'next/link'

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
      <li key={subNav.title} className='row-span-3'>
        <Link href={`/${language}${subNav.link}`} legacyBehavior passHref>
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} h-full flex flex-col justify-center`}
          >
            <div className='p-1 bg-white w-16 h-16 grid place-items-center rounded-full overflow-hidden'>
              <Image
                src={subNav.icon}
                width={54}
                height={54}
                alt={subNav.title}
              />
            </div>
            <p>{subNav.title}</p>
            <p className='text-xs text-center text-neutral-600 dark:text-neutral-400 max-w-40'>
              {subNav.description ? subNav.description : ''}
            </p>
          </NavigationMenuLink>
        </Link>
      </li>
    ) : (
      <li key={subNav.title} className='flex flex-col justify-center h-16'>
        <Link href={`/${language}${subNav.link}`} legacyBehavior passHref>
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} !w-full h-full flex flex-col !items-start`}
          >
            <p>{subNav.title}</p>
            <p className='text-xs text-neutral-600 dark:text-neutral-400'>
              {subNav.description ? subNav.description : ''}
            </p>
          </NavigationMenuLink>
        </Link>
      </li>
    )
  )
}
