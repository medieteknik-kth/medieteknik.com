import { getTranslation } from '@/app/i18n'
import AdminButton from '@/components/header/client/AdminButton'
import AuthenticatedNavigation from '@/components/header/client/AuthenticatedNavigation'
import CreateButton from '@/components/header/client/CreateButton'
import { WideScreenProfileButton } from '@/components/header/client/DropdownMenu'
import DropdownUploads from '@/components/header/client/DropdownUploads'
import StatisticsButton from '@/components/header/client/StatisticsButton'
import { Button } from '@/components/ui/button'
import { HomeIcon } from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
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
  const { t } = await getTranslation(language, 'header')

  return (
    <header
      id='header'
      className='left-2 right-2 bottom-2 md:left-5 md:right-5 md:top-5 rounded-md h-16 lg:h-24 bg-card fixed grid md:flex lg:grid grid-rows-1 grid-cols-5 md:grid-cols-3 2xl:grid-cols-2 justify-between place-items-center z-50 transition-all border dark:border-yellow-400 shadow-md'
    >
      <nav className='hidden md:flex h-full place-self-start md:col-span-2 2xl:col-span-1'>
        <Button
          variant={'ghost'}
          asChild
          className='h-full items-center justify-center'
        >
          <Link href={`/${language}?template=select`}>
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

        <AuthenticatedNavigation language={language} />

        <Button
          variant={'ghost'}
          asChild
          className='uppercase h-full bg-inherit'
        >
          <Link href={`/${language}/statistics`} title={t('nav.statistics')}>
            {t('nav.statistics')}
          </Link>
        </Button>

        <AdminButton language={language} />
      </nav>

      <Button
        asChild
        variant={'ghost'}
        size='icon'
        className='relative md:hidden flex w-full h-full items-center justify-center'
      >
        <Link href={`/${language}`}>
          <HomeIcon className='w-7 h-7' />
        </Link>
      </Button>

      <StatisticsButton language={language} />

      <CreateButton language={language} />

      <DropdownUploads language={language} />

      <div className='w-full md:w-auto place-self-end h-full col-start-5'>
        <WideScreenProfileButton language={language} />
      </div>
    </header>
  )
}
