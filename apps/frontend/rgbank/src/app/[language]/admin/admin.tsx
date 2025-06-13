'use client'

import OverviewPage from '@/app/[language]/admin/pages/overview/overview'
import SettingsPage from '@/app/[language]/admin/pages/settings'
import { useTranslation } from '@/app/i18n/client'
import HeaderGap from '@/components/header/components/HeaderGap'
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import type { Committee } from '@medieteknik/models/src/committee'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'

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
  const { t } = useTranslation(language, 'admin/admin')

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
      <div className='h-fit py-8 px-4 md:p-8 pt-0'>
        <div className='border-b pb-4 border-yellow-400'>
          <h1 className='text-3xl font-bold mt-4 tracking-tight'>
            {t('title')}
          </h1>
          <p className='text-muted-foreground'>{t('description')}</p>
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
                    <p className='capitalize'>{t(page.name)}</p>
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
