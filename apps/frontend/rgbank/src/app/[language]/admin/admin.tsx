'use client'

import OverviewPage from '@/app/[language]/admin/pages/overview/overview'
import SettingsPage from '@/app/[language]/admin/pages/settings'
import HeaderGap from '@/components/header/components/HeaderGap'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'

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
}

export default function Admin({ language, committees }: Props) {
  const { isLoading, isAuthenticated } = useAuthentication()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const category = searchParams.get('category') || 'overview'
  const router = useRouter()

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
      name: 'overview',
      page: OverviewPage,
    },
    {
      name: 'settings',
      page: SettingsPage,
    },
  ]

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push(`/${language}`)
    }
  }, [isLoading, isAuthenticated, language, router])

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
          className='flex flex-col lg:flex-row'
          orientation='vertical'
          defaultValue={category}
        >
          <aside id='sidebar' className='h-fit w-full lg:w-64 md:h-full'>
            <TabsList className='w-full h-fit flex items-start flex-col gap-2 pt-4 bg-white! dark:bg-background!'>
              {allPages.map((page) => (
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
              ))}
            </TabsList>
          </aside>
          {allPages.map((page) => (
            <TabsContent
              key={page.name}
              value={page.name}
              className='mt-0 grow z-10'
            >
              {page.page && (
                <page.page language={language} committees={committees} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  )
}
