'use client'

import LoginWrapper from '@/app/[language]/login/client/loginWrapper'
import Expense from '@/app/[language]/upload/expense/expense'
import FinalizeExpense from '@/app/[language]/upload/expense/finalizeExpense'
import FinalizeInvoice from '@/app/[language]/upload/invoice/finalizeInvoice'
import Invoice from '@/app/[language]/upload/invoice/invoice'
import SelectTemplate from '@/app/[language]/upload/select'
import { AnimatedTabsContent } from '@/components/animation/animated-tabs'
import FormProvider from '@/components/context/FormContext'
import { Tabs } from '@/components/ui/tabs'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  language: LanguageCode
  committees: Committee[]
}

export default function UploadForm({ language, committees }: Props) {
  const { isAuthenticated, isLoading } = useAuthentication()
  const searchParams = useSearchParams()
  const template = searchParams.get('template') || 'select'
  const [page, setPage] = useState(template)
  const pathname = usePathname()
  const router = useRouter()
  const loginUrl = `/${language}/login${
    pathname !== '/' ? `?return_url=${pathname}` : ''
  }`

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
    return <div className='h-[40.5rem]' />
  }

  if (!isAuthenticated) {
    return (
      <div className='min-h-[40.5rem] h-full flex flex-col gap-8'>
        <LoginWrapper language={language} onSuccess={() => {}} />
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
              committees={committees}
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
              committees={committees}
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
              committees={committees}
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
              committees={committees}
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
