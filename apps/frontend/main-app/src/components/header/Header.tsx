import { getAllCommittees } from '@/api/committee'
import { getSearchEntries } from '@/api/search'
import { useTranslation } from '@/app/i18n'
import {
  NarrowScreenProfileButton,
  WideScreenProfileButton,
} from '@/components/header/client/LoggedIn'
import NotificationMenu from '@/components/header/client/Notification'
import OptionsMenu from '@/components/header/client/Options'
import CommitteeDialog from '@/components/header/components/CommitteeDialog'
import ContextSearch from '@/components/header/components/ContextSearch'
import HeaderNavigationMenu from '@/components/header/components/HeaderNavigationMenu'
import QuickAccessMenu from '@/components/header/components/QuickAccess'
import type { HeaderElement } from '@/components/header/util/HeaderElement'
import { Button } from '@/components/ui/button'
import type { LanguageCode } from '@/models/Language'
import { CalendarDaysIcon, HomeIcon } from '@heroicons/react/24/outline'
import { Link } from 'next-view-transitions'
import Image from 'next/image'
import Logo from 'public/images/logo.webp'
import type { JSX } from 'react'

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
  const { data: cachedSearchEntries } = await getSearchEntries(language)
  const { data: committees } = await getAllCommittees(language)

  return (
    <header
      id='header'
      className='left-2 right-2 bottom-2 md:left-5 md:right-5 md:top-5 rounded-md h-16 lg:h-24 bg-white dark:bg-[#111] fixed grid md:flex lg:grid grid-rows-1 grid-cols-5 md:grid-cols-2 justify-between place-items-center z-50 transition-all border dark:border-yellow-400 shadow-md'
    >
      <div className='hidden md:flex h-full place-self-start'>
        <Button
          variant={'ghost'}
          asChild
          className='h-full items-center justify-center'
        >
          <Link href={`/${language}`} title={t('home')} aria-label={t('home')}>
            <Image
              src={Logo.src}
              alt='Medieteknik Logo'
              width={64}
              height={64}
              className='object-cover h-10 w-auto lg:h-16'
              priority
              sizes='(max-width: 768px) 64px, (max-width: 1200px) 128px, 256px'
            />
          </Link>
        </Button>
        <HeaderNavigationMenu
          language={language}
          headerElements={headerElements}
        />
      </div>

      <Button
        variant={'ghost'}
        size={'icon'}
        asChild
        className='relative md:hidden flex h-full items-center justify-center'
      >
        <Link href={`/${language}`} title={t('home')} aria-label={t('home')}>
          <HomeIcon className='w-7 h-7' />
        </Link>
      </Button>

      <Button
        variant={'ghost'}
        size={'icon'}
        asChild
        className='md:hidden flex h-full items-center justify-center'
      >
        <Link
          href={`/${language}/bulletin`}
          title={t('bulletin')}
          aria-label={t('bulletin')}
        >
          <CalendarDaysIcon className='w-7 h-7' />
        </Link>
      </Button>

      <div className='absolute md:static w-fit md:w-full h-full flex top-0 bottom-0 my-auto justify-center md:justify-end items-center gap-4'>
        <ContextSearch
          language={language}
          cachedSearchEntries={cachedSearchEntries}
        />
        <QuickAccessMenu language={language} />

        <div className='hidden md:flex items-center justify-end w-fit h-full place-self-end'>
          <OptionsMenu language={language} />
          <NotificationMenu language={language} />
          <WideScreenProfileButton language={language} />
        </div>
      </div>

      <div className='md:hidden col-start-4'>
        <CommitteeDialog language={language} committees={committees} />
      </div>

      <div className='h-full md:hidden col-start-5'>
        <NarrowScreenProfileButton language={language} />
      </div>
    </header>
  )
}
