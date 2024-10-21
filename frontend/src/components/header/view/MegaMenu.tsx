import { HeaderElement } from '@/components/header/util/HeaderElement'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'

interface Props {
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
  headerElement,
}: Props): Promise<JSX.Element[]> {
  if (!headerElement.subNavs) {
    throw new Error('Element must have subNavs')
  }

  return headerElement.subNavs.map((subNav) =>
    subNav.icon ? (
      <li key={subNav.title} className='row-span-3'>
        <Link href={subNav.link} legacyBehavior passHref>
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} h-full flex flex-col justify-center`}
          >
            <Avatar className='w-16 h-16 bg-white rounded-full overflow-hidden'>
              <AvatarImage
                className='h-16 w-auto aspect-square object-fill p-1.5'
                width={128}
                height={128}
                src={subNav.icon}
              />
            </Avatar>
            <p>{subNav.title}</p>
            <p className='text-xs text-center text-neutral-600 dark:text-neutral-400 max-w-40'>
              {subNav.description ? subNav.description : ''}
            </p>
          </NavigationMenuLink>
        </Link>
      </li>
    ) : (
      <li key={subNav.title} className='flex flex-col justify-center h-16'>
        <Link href={subNav.link} legacyBehavior passHref>
          <NavigationMenuLink
            href={subNav.link}
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
