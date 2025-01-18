'use client'

import { useTranslation } from '@/app/i18n/client'
import HeaderGap from '@/components/header/components/HeaderGap'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import {
  CalendarDaysIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  NewspaperIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Logo from 'public/images/logo.webp'
import { type JSX, useCallback } from 'react'
import Content from './content'
import EditCommittee from './edit'

interface Props {
  language: LanguageCode
  committeeData: Committee
  committeeName: string
}

/**
 * @name CommitteeLandingPage
 * @description The landing page for managing a committee, after the redirect component
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 * @param {Committee} props.committeeData - The committee data
 * @param {string} props.committeeName - The committee name
 *
 * @returns {JSX.Element} The rendered component
 */
export default function CommitteeLandingPage({
  language,
  committeeData,
  committeeName,
}: Props): JSX.Element {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const tab = searchParams.get('tab') || 'home'
  const router = useRouter()
  const { t } = useTranslation(language, 'committee_management')

  const createTabString = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams.toString())

      params.set('tab', tab)

      return params.toString()
    },
    [searchParams]
  )

  return (
    <>
      <HeaderGap />
      <Breadcrumb className='w-full h-fit border-b px-4 py-2'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${language}/chapter`} className='py-2'>
              {t('chapter')}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/${language}/chapter/committees`}
              className='py-2'
            >
              {t('committees')}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/${language}/chapter/committees/${committeeName}`}
              className='capitalize py-2'
            >
              {committeeName}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t('manage')}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='w-full h-fit sm:mt-32 relative'>
        <div className='flex flex-wrap flex-col sm:flex-row items-center sm:absolute left-16 gap-4 -top-28'>
          <Link
            href={`/chapter/committees/${committeeName}`}
            target='_blank'
            title={`${committeeName.charAt(0).toUpperCase()}${committeeName.slice(1)} Page`}
            className='w-32 h-32 grid place-items-center bg-white rounded-full overflow-hidden hover:scale-110 transition-transform'
          >
            <Image
              src={committeeData.logo_url || Logo.src}
              alt={`${committeeName.charAt(0).toUpperCase()}${committeeName.slice(1)} Logo`}
              width={256}
              height={256}
              priority
              loading='eager'
              className='w-28 h-auto object-cover p-2'
            />
          </Link>
          <div className='flex flex-wrap flex-col sm:flex-row gap-4 items-center'>
            <h1 className='capitalize tracking-wide text-3xl'>
              {decodeURIComponent(committeeName)}
            </h1>
            <EditCommittee committee={committeeData} language={language} />
          </div>
        </div>
        <div className='flex mb-10 sm:mt-16'>
          <div className='w-full h-fit flex px-8 md:px-20'>
            <Tabs defaultValue={tab} className='w-full h-fit mt-8'>
              <TabsList className='h-fit flex flex-wrap space-x-1 justify-start lg:ml-32 z-30 lg:absolute -top-4'>
                <TabsTrigger
                  value='home'
                  className='w-36 h-10 flex justify-start items-center'
                  onClick={() =>
                    router.push(`${pathname}?${createTabString('home')}`)
                  }
                >
                  <HomeIcon className='w-6 h-6 mr-2' />
                  <span>{t('tab.home')}</span>
                </TabsTrigger>
                <TabsTrigger
                  value='members'
                  className='w-36 h-10 flex justify-start items-center'
                  onClick={() =>
                    router.push(`${pathname}?${createTabString('members')}`)
                  }
                >
                  <UserGroupIcon className='w-6 h-6 mr-2' />

                  <span>{t('tab.members')}</span>
                </TabsTrigger>
                <TabsTrigger
                  value='news'
                  className='w-36 h-10 flex justify-start items-center'
                  onClick={() =>
                    router.push(`${pathname}?${createTabString('news')}`)
                  }
                >
                  <NewspaperIcon className='w-6 h-6 mr-2' />
                  <span>{t('tab.news')}</span>
                </TabsTrigger>
                <TabsTrigger
                  value='events'
                  className='w-36 h-10 flex justify-start items-center'
                  onClick={() =>
                    router.push(`${pathname}?${createTabString('events')}`)
                  }
                >
                  <CalendarDaysIcon className='w-6 h-6 mr-2' />
                  <span>{t('tab.events')}</span>
                </TabsTrigger>
                <TabsTrigger
                  value='documents'
                  className='w-36 h-10 flex justify-start items-center'
                  onClick={() =>
                    router.push(`${pathname}?${createTabString('documents')}`)
                  }
                >
                  <DocumentDuplicateIcon className='w-6 h-6 mr-2' />
                  <span>{t('tab.documents')}</span>
                </TabsTrigger>
              </TabsList>
              <Content language={language} committee={committeeData} />
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}
