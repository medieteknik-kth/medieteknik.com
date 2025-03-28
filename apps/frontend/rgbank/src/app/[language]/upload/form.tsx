'use client'

import Expense from '@/app/[language]/upload/expense/expense'
import FinalizeExpense from '@/app/[language]/upload/expense/finalizeExpense'
import FinalizeInvoice from '@/app/[language]/upload/invoice/finalizeInvoice'
import Invoice from '@/app/[language]/upload/invoice/invoice'
import SelectTemplate from '@/app/[language]/upload/select'
import FormProvider from '@/components/context/FormContext'
import { AnimatedTabsContent } from '@/components/ui/animated-tabs'
import { Tabs } from '@/components/ui/tabs'
import type Committee from '@/models/Committee'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

interface Props {
  committees: Committee[]
}

export default function UploadForm({ committees }: Props) {
  const searchParams = useSearchParams()
  const template = searchParams.get('template') || 'select'
  const [page, setPage] = useState(template)
  const pathname = usePathname()
  const router = useRouter()

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

  // TODO: Create a provider for the forms

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
            className='bg-neutral-100 h-full w-full flex flex-col sm:p-4 md:p-8'
          >
            <Invoice
              committees={committees}
              onBack={() => {
                removeSearchParams()
                setPage('select')
              }}
              onFinalize={() => {
                setPage('invoice-finalize')
              }}
            />
          </AnimatedTabsContent>
          <AnimatedTabsContent
            activeValue={page}
            animationStyle='slide'
            value='invoice-finalize'
            className='bg-neutral-100 h-full w-full flex flex-col sm:p-4 md:p-8'
          >
            <FinalizeInvoice />
          </AnimatedTabsContent>
          <AnimatedTabsContent
            activeValue={page}
            animationStyle='slide'
            value='expense'
            className='bg-neutral-100 h-full w-full flex flex-col sm:p-4 md:p-8'
          >
            <Expense
              committees={committees}
              onBack={() => {
                removeSearchParams()
                setPage('select')
              }}
              onFinalize={() => {
                setPage('expense-finalize')
              }}
            />
          </AnimatedTabsContent>
          <AnimatedTabsContent
            activeValue={page}
            animationStyle='slide'
            value='expense-finalize'
            className='bg-neutral-100 h-full w-full flex flex-col sm:p-4 md:p-8'
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
