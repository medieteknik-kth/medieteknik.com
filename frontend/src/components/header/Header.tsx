import { useTranslation } from '@/app/i18n'
import HeaderNavigationMenu from '@/components/header/components/HeaderNavigationMenu'
import { HeaderElement } from '@/components/header/util/HeaderElement'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import Logo from 'public/images/logo.webp'
import LoginSection from './client/LoginSection'
import NavigationSheet from './NavigationSheet'

import type { JSX } from 'react'
import { LanguageCode } from '@/models/Language'

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
export default async function Header({
  language,
}: Props): Promise<JSX.Element> {
  const { t } = await useTranslation(language, 'header')
  const headerElements: HeaderElement[] = t('navs', {
    returnObjects: true,
  }) as HeaderElement[]

  return (
    <header
      id='header'
      className='w-full h-16 lg:h-24 text-black bg-white dark:bg-[#111] dark:text-white fixed flex justify-between z-50 transition-all shadow-sm shadow-black/25 dark:shadow-yellow-400/25'
    >
      <div className='w-fit h-full flex z-20'>
        <Button variant={'ghost'} className='hidden lg:block' asChild>
          <Link
            href={'/' + language}
            className='w-full h-full flex items-center z-10 relative'
            title={t('home')}
            aria-label='Home Button'
          >
            <Image
              src={Logo.src}
              alt='placeholder'
              width={64}
              height={64}
              className='w-auto h-full py-3'
            />
          </Link>
        </Button>
        <NavigationSheet language={language} headerElements={headerElements} />
        <HeaderNavigationMenu
          language={language}
          headerElements={headerElements}
        />
      </div>
      <LoginSection language={language} />
    </header>
  )
}
