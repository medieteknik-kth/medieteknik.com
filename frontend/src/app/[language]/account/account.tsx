'use client'

import AccountForm from '@/app/[language]/account/pages/account/accountForm'
import ProfileForm from '@/app/[language]/account/pages/account/profileForm'
import ReceptionForm from '@/app/[language]/account/pages/account/receptionForm'
import NotificationPage from '@/app/[language]/account/pages/notificationPage'
import PreferencesPage from '@/app/[language]/account/pages/preferencesPage'
import { useTranslation } from '@/app/i18n/client'
import HeaderGap from '@/components/header/components/HeaderGap'
import Loading from '@/components/tooltips/Loading'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { LanguageCode } from '@/models/Language'
import {
  useAuthentication,
  useStudent,
} from '@/providers/AuthenticationProvider'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type React from 'react'
import { type JSX, use, useCallback, useEffect, useState } from 'react'

interface AllPages {
  name: string
  page?: React.ComponentType<{ language: LanguageCode }>
  subNavs?: {
    name: string
    page: React.ComponentType<{ language: LanguageCode }>
  }[]
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
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const category = searchParams.get('category') || 'account'
  const router = useRouter()
  const { isLoading: authLoading } = useAuthentication()
  const { student } = useStudent()
  const { t } = useTranslation(language, 'account/account')
  const [openCollapsible, setOpenCollapsible] = useState<boolean[]>([true])

  useEffect(() => {
    if (!authLoading) {
      if (!student) {
        router.push(`/${language}`)
      } else {
        setIsLoading(false)
      }
    }
  }, [student, language, router, authLoading])

  const createTabString = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams.toString())

      params.set('category', tab)

      return params.toString()
    },
    [searchParams]
  )

  const allPages: AllPages[] = [
    {
      name: 'account',
      subNavs: [
        {
          name: 'account',
          page: AccountForm,
        },
        {
          name: 'profile',
          page: ProfileForm,
        },
        {
          name: 'reception',
          page: ReceptionForm,
        },
      ],
    },
    {
      name: 'preferences',
      page: PreferencesPage,
    },
    {
      name: 'notifications',
      page: NotificationPage,
    },
  ]

  if (isLoading) {
    return <Loading language={language} />
  }

  if (!student) {
    return <div>Student not found</div>
  }

  return (
    <main id='account' className='relative md:max-h-screen'>
      <HeaderGap />
      <div className='h-fit p-8 pt-0'>
        <div className='border-b pb-4 border-yellow-400'>
          <h1 className='text-3xl font-bold mt-4 tracking-tight'>
            {t('title')}
          </h1>
          <p className='text-muted-foreground'>{t('description')}</p>
        </div>

        <Tabs
          className='flex flex-col md:flex-row'
          orientation='vertical'
          defaultValue={category}
        >
          <aside id='sidebar' className='h-fit w-full md:w-64 md:h-full'>
            <TabsList className='w-full h-fit flex items-start flex-col gap-2 pt-4 bg-white! dark:bg-background!'>
              {Array.from(allPages).map((page, index) => {
                return page.subNavs ? (
                  <Collapsible
                    key={page.name}
                    title={t(`upper_${page.name}`)}
                    defaultOpen
                    className='w-full'
                  >
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
                        <p className='capitalize'>{t(`upper_${page.name}`)}</p>
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
                          title={t(`tab_${subNav.name}`)}
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
                            <p className='capitalize'>
                              {t(`tab_${subNav.name}`)}
                            </p>
                          </Button>
                        </TabsTrigger>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <TabsTrigger
                    asChild
                    value={page.name}
                    key={page.name}
                    title={t(`tab_${page.name}`)}
                  >
                    <Button
                      key={page.name}
                      variant={'ghost'}
                      onClick={() => {
                        router.push(`${pathname}?${createTabString(page.name)}`)
                      }}
                      className='w-full flex justify-start gap-2 p-2 rounded-md data-[state=active]:bg-muted!'
                    >
                      <p className='capitalize'>{t(`tab_${page.name}`)}</p>
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
                  <subNav.page language={language} />
                </TabsContent>
              ))
            ) : (
              <TabsContent
                key={page.name}
                value={page.name}
                className='mt-0 grow z-10'
              >
                {page.page && <page.page language={language} />}
              </TabsContent>
            )
          )}
        </Tabs>
      </div>
    </main>
  )
}
