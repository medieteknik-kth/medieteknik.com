'use client'

import Sidebar from '@/app/[language]/account/sidebar'
import HeaderGap from '@/components/header/components/HeaderGap'
import Loading from '@/components/tooltips/Loading'
import type { LanguageCode } from '@/models/Language'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import CalendarProvider from '@/providers/CalendarProvider'
import {
  CalendarIcon,
  DocumentDuplicateIcon,
  LifebuoyIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { useRouter, useSearchParams } from 'next/navigation'
import React, {
  type ForwardRefExoticComponent,
  type JSX,
  type LazyExoticComponent,
  Suspense,
  type SVGProps,
  use,
  useEffect,
  useState,
} from 'react'
const AccountProfile = React.lazy(() => import('./pages/accountPage'))
const PreferencesPage = React.lazy(() => import('./pages/preferencesPage'))
//const CommitteesPage = React.lazy(() => import('./pages/committeesPage'))
const ItemsPage = React.lazy(() => import('./pages/itemPage'))
const CalendarPage = React.lazy(() => import('./pages/calendarPage'))

export type Tabs =
  | 'account'
  | 'preferences'
  | 'committees'
  | 'items'
  | 'calendar'

export interface AccountPages {
  name: Tabs
  icon: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
  page: LazyExoticComponent<
    ({ language }: { language: LanguageCode }) => React.JSX.Element
  >
}

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

/**
 * @name AccountPage
 * @description The component that renders the account page, allowing the user to view and edit their account settings
 *
 * @param {Props} props
 * @param {Promise<Params>} props.params - The parameters of the account page
 * @param {string} props.params.language - The language of the account page
 *
 * @returns {JSX.Element} The account page
 */
export default function AccountPage(props: Props): JSX.Element {
  const { language } = use(props.params)
  const [currentTab, setCurrentTab] = useState<Tabs | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [accountPages, setAccountPages] = useState<AccountPages[]>([])
  const router = useRouter()

  const {
    student,
    committees,
    permissions,
    isLoading: authLoading,
  } = useAuthentication()

  useEffect(() => {
    if (!authLoading) {
      if (!student) {
        router.push(`/${language}`)
      } else {
        setIsLoading(false)
      }
    }
  }, [student, language, router, authLoading])

  useEffect(() => {
    const defaultPages: AccountPages[] = [
      {
        name: 'account',
        icon: UserIcon,
        page: AccountProfile,
      },
      {
        name: 'preferences',
        icon: LifebuoyIcon,
        page: PreferencesPage,
      },
      {
        name: 'calendar',
        icon: CalendarIcon,
        page: CalendarPage,
      },
    ]

    const additionalPages: AccountPages[] = []
    if (permissions.author && permissions.author.length >= 1) {
      additionalPages.push({
        name: 'items',
        icon: DocumentDuplicateIcon,
        page: ItemsPage,
      })
    }

    /*
    if (committees.length >= 1) {
      additionalPages.push({
        name: 'committees',
        icon: UserGroupIcon,
        page: CommitteesPage,
      })
    }*/

    setAccountPages([...defaultPages, ...additionalPages])
  }, [permissions])

  const searchParams = useSearchParams()

  useEffect(() => {
    const tab = searchParams.get('category') || 'account'
    setCurrentTab(tab as Tabs)
  }, [searchParams])

  if (isLoading) {
    return <Loading language={language} />
  }

  if (!student) {
    return <div>Student not found</div>
  }

  return (
    <main className='relative'>
      <HeaderGap />
      <div className='w-full h-full relative'>
        <Sidebar
          accountPages={accountPages}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />

        <div className='w-full min-h-[1080px] h-fit flex dark:bg-[#111]'>
          <div className='w-0 md:w-24' />
          <Suspense fallback={<Loading language={language} />}>
            {Array.from(accountPages).map((page) =>
              currentTab === page.name.toLocaleLowerCase() ? (
                page.name === 'calendar' ? (
                  <CalendarProvider language={language} key='calendar'>
                    <CalendarPage language={language} key='calendar' />
                  </CalendarProvider>
                ) : (
                  <page.page key={page.name} language={language} />
                )
              ) : (
                <div key={page.name} />
              )
            )}
          </Suspense>
        </div>
      </div>
    </main>
  )
}
