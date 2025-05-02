'use client'

import AccountPage from '@/app/[language]/account/pages/account/accountPage'
import Expense from '@/app/[language]/upload/expense/expense'
import FinalizeExpense from '@/app/[language]/upload/expense/finalizeExpense'
import FinalizeInvoice from '@/app/[language]/upload/invoice/finalizeInvoice'
import Invoice from '@/app/[language]/upload/invoice/invoice'
import SelectTemplate from '@/app/[language]/upload/select'
import { useTranslation } from '@/app/i18n/client'
import { AnimatedTabsContent } from '@/components/animation/animated-tabs'
import LoginWrapper from '@/components/login/loginWrapper'
import Loading from '@/components/ui/loading'
import { Tabs } from '@/components/ui/tabs'
import FormProvider from '@/context/FormContext'
import type Committee from '@/models/Committee'
import type { ExpenseDomain } from '@/models/ExpenseDomain'
import type { LanguageCode } from '@/models/Language'
import {
  useAuthentication,
  useStudent,
} from '@/providers/AuthenticationProvider'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'

interface Props {
  language: LanguageCode
  committees: Committee[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function UploadForm({ language, committees }: Props) {
  const { data: expenseDomains, error } = useSWR<ExpenseDomain[]>(
    '/api/public/rgbank/expense-domains',
    fetcher,
    {
      fallbackData: [],
    }
  )
  const { isAuthenticated, isLoading } = useAuthentication()
  const { bank_account } = useStudent()
  const searchParams = useSearchParams()
  const template = searchParams.get('template') || 'select'
  const [page, setPage] = useState(template)
  const pathname = usePathname()
  const router = useRouter()
  const { t: errors } = useTranslation(language, 'errors')
  const { t: account } = useTranslation(language, 'errors')

  const handleTabChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      params.set('template', value)

      router.replace(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const removeSearchParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('template')
    router.replace(`${pathname}?${params.toString()}`)
  }, [pathname, router, searchParams])

  const moveToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])

  useEffect(() => {
    setPage(template)
  }, [template])

  if (isLoading) {
    return (
      <div className='min-h-[40.5rem] h-full flex flex-col gap-8'>
        <Loading language={language} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className='min-h-[40.5rem] h-full flex flex-col gap-8'>
        <LoginWrapper language={language} onSuccess={() => {}} />
      </div>
    )
  }

  if (!expenseDomains || error) {
    return (
      <div className='min-h-[40.5rem] h-full flex flex-col items-center gap-y-20 sm:p-4 md:p-8'>
        <div>
          <p className='text-center text-sm text-muted-foreground'>
            {errors('domains.notFound')}
          </p>
          <h1 className='text-3xl font-bold text-center'>
            {errors('generic')}
          </h1>
        </div>
        <AccountPage language={language} includeBanner={false} />
      </div>
    )
  }

  if (!bank_account) {
    return (
      <div className='min-h-[40.5rem] h-full flex flex-col items-center gap-y-20 sm:p-4 md:p-8'>
        <div>
          <p className='text-center text-sm text-muted-foreground'>
            {account('bank_account.missing.description')}
          </p>
          <h1 className='text-3xl font-bold text-center'>
            {account('bank_account.missing.title')}
          </h1>
        </div>
        <AccountPage language={language} includeBanner={false} />
      </div>
    )
  }

  return (
    <FormProvider>
      <div className='flex flex-col items-center justify-between'>
        <Tabs value={page} onValueChange={setPage} className='w-full h-full'>
          <AnimatedTabsContent
            activeValue={page}
            animationStyle='slide'
            value='select'
            className='h-full w-full flex flex-col sm:p-4 md:p-8'
          >
            <SelectTemplate
              language={language}
              onClickCallback={(template) => {
                handleTabChange(template)
                setPage(template)
              }}
            />
          </AnimatedTabsContent>
          <AnimatedTabsContent
            activeValue={page}
            animationStyle='slide'
            value='invoice'
            className='bg-neutral-100 h-full w-full flex flex-col sm:p-4 md:p-8 dark:bg-neutral-900'
          >
            <Invoice
              language={language}
              committees={committees}
              expenseDomains={expenseDomains}
              toExpense={() => {
                handleTabChange('expense')
                setPage('expense')
              }}
              onBack={() => {
                removeSearchParams()
                setPage('select')
              }}
              onFinalize={() => {
                moveToTop()
                setTimeout(() => {
                  setPage('invoice-finalize')
                }, 200)
              }}
            />
          </AnimatedTabsContent>
          <AnimatedTabsContent
            activeValue={page}
            animationStyle='slide'
            value='invoice-finalize'
            className='bg-neutral-100 h-full w-full flex flex-col sm:p-4 md:p-8 dark:bg-neutral-900'
          >
            <FinalizeInvoice
              language={language}
              onBack={() => {
                setPage('invoice')
              }}
            />
          </AnimatedTabsContent>
          <AnimatedTabsContent
            activeValue={page}
            animationStyle='slide'
            value='expense'
            className='bg-neutral-100 h-full w-full flex flex-col sm:p-4 md:p-8 dark:bg-neutral-900'
          >
            <Expense
              language={language}
              committees={committees}
              expenseDomains={expenseDomains}
              onBack={() => {
                removeSearchParams()
                setPage('select')
              }}
              onFinalize={() => {
                moveToTop()
                setTimeout(() => {
                  setPage('expense-finalize')
                }, 200)
              }}
            />
          </AnimatedTabsContent>
          <AnimatedTabsContent
            activeValue={page}
            animationStyle='slide'
            value='expense-finalize'
            className='bg-neutral-100 h-full w-full flex flex-col sm:p-4 md:p-8 dark:bg-neutral-900'
          >
            <FinalizeExpense
              language={language}
              onBack={() => {
                setPage('expense')
              }}
            />
          </AnimatedTabsContent>
        </Tabs>
      </div>
    </FormProvider>
  )
}
