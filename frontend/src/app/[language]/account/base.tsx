'use client'
import {
  UserIcon,
  DocumentDuplicateIcon,
  LifebuoyIcon,
  UserGroupIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import React, {
  ForwardRefExoticComponent,
  LazyExoticComponent,
  Suspense,
  SVGProps,
  useEffect,
  useState,
} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Loading from '@/components/tooltips/Loading'
import CalendarProvider from '@/providers/CalendarProvider'
import Sidebar from './sidebar'
import { useAuthentication } from '@/providers/AuthenticationProvider'
const AccountPage = React.lazy(() => import('./pages/accountPage'))
const PreferencesPage = React.lazy(() => import('./pages/preferencesPage'))
const CommitteesPage = React.lazy(() => import('./pages/committeesPage'))
const ItemsPage = React.lazy(() => import('./pages/itemPage'))
const CalendarPage = React.lazy(() => import('./pages/calendarPage'))

export type Tabs =
  | 'account'
  | 'preferences'
  | 'committees'
  | 'items'
  | 'calendar'

export interface AccountPage {
  name: Tabs
  icon: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
  page: LazyExoticComponent<
    ({ language }: { language: string }) => React.JSX.Element
  >
}

export default function Base({
  params: { language },
}: {
  params: { language: string }
}) {
  const [currentTab, setCurrentTab] = useState<Tabs | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [accountPages, setAccountPages] = useState<AccountPage[]>([])
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
        router.push(`/${language}/login`)
      } else {
        setIsLoading(false)
      }
    }
  }, [student, language, router, authLoading])

  useEffect(() => {
    const defaultPages: AccountPage[] = [
      {
        name: 'account',
        icon: UserIcon,
        page: AccountPage,
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

    const additionalPages: AccountPage[] = []
    if (permissions &&  permissions.author.length >= 1) {
      additionalPages.push({
        name: 'items',
        icon: DocumentDuplicateIcon,
        page: ItemsPage,
      })
    }

    if (committees.length >= 1) {
      additionalPages.push({
        name: 'committees',
        icon: UserGroupIcon,
        page: CommitteesPage,
      })
    }

    setAccountPages([...defaultPages, ...additionalPages])
  }, [committees, permissions])

  const searchParams = useSearchParams()

  useEffect(() => {
    const tab = searchParams.get('category') || 'account'
    setCurrentTab(tab as Tabs)
  }, [searchParams])

  if (isLoading) {
    return <Loading language={language} />
  }

  return (
    <main className='relative'>
      <div className='h-24 bg-black' />
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
