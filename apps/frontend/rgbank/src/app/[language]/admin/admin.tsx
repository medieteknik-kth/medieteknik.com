'use client'

import AdminPage from '@/app/[language]/admin/pages/admin'
import ExpensesAwaitingPage from '@/app/[language]/admin/pages/expense/awaiting'
import ExpensesHistoryPage from '@/app/[language]/admin/pages/expense/history'
import InvoicesAwaitingPage from '@/app/[language]/admin/pages/invoice/awaiting'
import InvoicesHistoryPage from '@/app/[language]/admin/pages/invoice/history'
import OverviewPage from '@/app/[language]/admin/pages/overview'
import SettingsPage from '@/app/[language]/admin/pages/settings'
import HeaderGap from '@/components/header/components/HeaderGap'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

interface Props {
  language: LanguageCode
  committees: Committee[]
}

interface Page {
  name: string
  page?: React.ComponentType<{
    language: LanguageCode
    committees?: Committee[]
  }>
  subNavs?: {
    name: string
    page: React.ComponentType<{
      language: LanguageCode
      committees?: Committee[]
    }>
  }[]
}

export default function Admin({ language, committees }: Props) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const category = searchParams.get('category') || 'admin'
  const router = useRouter()
  const [openCollapsible, setOpenCollapsible] = useState<boolean[]>([
    false,
    false,
  ])

  const createTabString = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams.toString())

      params.set('category', tab)

      return params.toString()
    },
    [searchParams]
  )

  const allPages: Page[] = [
    {
      name: 'admin',
      page: AdminPage,
    },
    {
      name: 'overview',
      page: OverviewPage,
    },
    {
      name: 'expenses',
      subNavs: [
        {
          name: 'expenses_awaiting',
          page: ExpensesAwaitingPage,
        },
        {
          name: 'expenses_history',
          page: ExpensesHistoryPage,
        },
      ],
    },
    {
      name: 'invoices',
      subNavs: [
        {
          name: 'invoices_awaiting',
          page: InvoicesAwaitingPage,
        },
        {
          name: 'invoices_history',
          page: InvoicesHistoryPage,
        },
      ],
    },
    {
      name: 'settings',
      page: SettingsPage,
    },
  ]

  return (
    <main>
      <HeaderGap />
      <div className='h-fit p-8 pt-0'>
        <div className='border-b pb-4 border-yellow-400'>
          <h1 className='text-3xl font-bold mt-4 tracking-tight'>Admin</h1>
          <p className='text-muted-foreground'>
            Admin page for managing the application and its users.
          </p>
        </div>

        <Tabs
          className='flex flex-col md:flex-row'
          orientation='vertical'
          defaultValue={category}
        >
          <aside id='sidebar' className='h-fit w-full md:w-64 md:h-full'>
            <TabsList className='w-full h-fit flex items-start flex-col gap-2 pt-4 bg-white! dark:bg-background!'>
              {allPages.map((page, index) => {
                return page.subNavs ? (
                  <Collapsible key={page.name} defaultOpen className='w-full'>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant={'ghost'}
                        className='w-full flex justify-between gap-2 p-2 rounded-md mb-2'
                        onClick={() => {
                          setOpenCollapsible((prev) =>
                            prev.map((_, i) => (i === index ? !prev[i] : false))
                          )
                        }}
                      >
                        <p className='capitalize'>{page.name}</p>
                        <ChevronDownIcon
                          className={`w-5 h-5 transition-transform duration-200 ${
                            openCollapsible[index] ? 'rotate-180' : ''
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className='border-l border-yellow-400 ml-2 pl-3 flex flex-col gap-2'>
                      {page.subNavs.map((subNav) => (
                        <TabsTrigger
                          asChild
                          value={subNav.name}
                          key={subNav.name}
                        >
                          <Button
                            variant={'ghost'}
                            onClick={() => {
                              router.push(
                                `${pathname}?${createTabString(subNav.name)}`
                              )
                            }}
                            className='w-full flex justify-start gap-2 p-2 rounded-md data-[state=active]:bg-muted!'
                          >
                            <p className='capitalize'>{subNav.name}</p>
                          </Button>
                        </TabsTrigger>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <TabsTrigger asChild value={page.name} key={page.name}>
                    <Button
                      key={page.name}
                      variant={'ghost'}
                      onClick={() => {
                        router.push(`${pathname}?${createTabString(page.name)}`)
                      }}
                      className='w-full flex justify-start gap-2 p-2 rounded-md data-[state=active]:bg-muted!'
                    >
                      <p className='capitalize'>{page.name}</p>
                    </Button>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </aside>
          {allPages.map((page) =>
            page.subNavs ? (
              page.subNavs.map((subNav) => (
                <TabsContent
                  key={subNav.name}
                  value={subNav.name}
                  className='mt-0 grow z-10'
                >
                  <subNav.page language={language} committees={committees} />
                </TabsContent>
              ))
            ) : (
              <TabsContent
                key={page.name}
                value={page.name}
                className='mt-0 grow z-10'
              >
                {page.page && (
                  <page.page language={language} committees={committees} />
                )}
              </TabsContent>
            )
          )}
        </Tabs>
      </div>
    </main>
  )
}
