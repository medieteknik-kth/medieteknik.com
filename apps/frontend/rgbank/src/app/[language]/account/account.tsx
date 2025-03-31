'use client'

import AccountPage from '@/app/[language]/account/pages/account/accountPage'
import ActivityPage from '@/app/[language]/account/pages/activity/activityPage'
import HeaderGap from '@/components/header/components/HeaderGap'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { LanguageCode } from '@/models/Language'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { use, useCallback } from 'react'

interface Page {
  name: string
  page?: React.ComponentType<{ language: LanguageCode }>
}

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

export default function Account(props: Props) {
  const { language } = use(props.params)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const category = searchParams.get('category') || 'account'
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
      name: 'account',
      page: AccountPage,
    },
    {
      name: 'activity',
      page: ActivityPage,
    },
  ]

  return (
    <main className='relative'>
      <HeaderGap />
      <div className='h-fit p-8 pt-0'>
        <div className='border-b pb-4 border-yellow-400'>
          <h1 className='text-3xl font-bold mt-4 tracking-tight'>Account</h1>
          <p className='text-muted-foreground'>
            Manage your account and see your activity.
          </p>
        </div>

        <Tabs
          className='flex flex-col md:flex-row'
          orientation='vertical'
          defaultValue={category}
        >
          <aside id='sidebar' className='h-fit w-full md:w-64 md:h-full'>
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
              className='w-full md:w-3/4 h-fit pt-4'
              key={page.name}
              value={page.name}
            >
              {page.page && <page.page language={language} />}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  )
}
