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
import { useState } from 'react'

interface Props {
  committees: Committee[]
}

export default function UploadForm({ committees }: Props) {
  const [page, setPage] = useState('template')

  // TODO: Create a provider for the forms

  return (
    <FormProvider>
      <div className='flex flex-col items-center justify-between'>
        <Tabs value={page} onValueChange={setPage} className='w-full h-full'>
          <AnimatedTabsContent
            activeValue={page}
            animationStyle='slide'
            value='template'
            className='h-full w-full flex flex-col sm:p-4 md:p-8'
          >
            <SelectTemplate
              onClickCallback={(template) => {
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
                setPage('template')
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
                setPage('template')
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
