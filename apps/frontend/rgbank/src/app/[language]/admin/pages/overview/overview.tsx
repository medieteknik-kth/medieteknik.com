'use client'

import OverviewCards from '@/app/[language]/admin/pages/overview/cards'
import OverviewKanban from '@/app/[language]/admin/pages/overview/kanban'
import { useTranslation } from '@/app/i18n/client'
import Loading from '@/components/ui/loading'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ExpenseResponse } from '@/models/Expense'
import type { InvoiceResponse } from '@/models/Invoice'
import type { LanguageCode } from '@/models/Language'
import { TableCellsIcon, ViewColumnsIcon } from '@heroicons/react/24/outline'
import { useCallback } from 'react'
import useSWR from 'swr'

interface Props {
  language: LanguageCode
}

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then((res) => res.json())

export default function OverviewPage({ language }: Props) {
  const { t } = useTranslation(language, 'admin/overview')
  const {
    data: invoices,
    isLoading: invoicesLoading,
    error: invoiceError,
  } = useSWR<InvoiceResponse[]>('/api/rgbank/invoices/all', fetcher, {
    fallbackData: [],
  })

  const {
    data: expenses,
    isLoading: expensesLoading,
    error: expenseError,
  } = useSWR<ExpenseResponse[]>('/api/rgbank/expenses/all', fetcher, {
    fallbackData: [],
  })

  const updateLocalStorage = useCallback((value: string) => {
    if (typeof window === 'undefined') return

    localStorage.setItem('admin-prefered-view', JSON.stringify(value))
  }, [])

  if (invoiceError || expenseError) {
    return <div>Error loading invoices</div>
  }

  if (
    !invoices ||
    invoicesLoading ||
    !Array.isArray(invoices) ||
    !expenses ||
    expensesLoading ||
    !Array.isArray(expenses)
  ) {
    return (
      <section className='h-screen w-full flex items-center justify-center'>
        <Loading language={language} />
      </section>
    )
  }

  return (
    <section className='grow h-fit mb-8 2xl:mb-0 pr-10'>
      <div className='w-full mb-4 px-4 pt-4'>
        <h2 className='text-lg font-bold'>{t('title')}</h2>
        <p className='text-sm text-muted-foreground'>{t('description')}</p>
        <Separator className='bg-yellow-400 mt-4' />
      </div>

      <Tabs
        defaultValue={
          typeof window === 'undefined'
            ? 'cards'
            : JSON.parse(
                localStorage.getItem('admin-prefered-view') || '"cards"'
              )
        }
        className='w-full mb-4 ml-4 pr-8'
      >
        <TabsList className='bg-transparent flex gap-4 justify-start'>
          <TabsTrigger
            value='cards'
            className='w-fit border-b-2 border-transparent data-[state=active]:border-yellow-400'
            onClick={() => updateLocalStorage('cards')}
          >
            <TableCellsIcon className='w-4 h-4 mr-2' />
            {t('view.cards')}
          </TabsTrigger>
          <TabsTrigger
            value='kanban'
            className='w-fit border-b-2 border-transparent data-[state=active]:border-yellow-400'
            onClick={() => updateLocalStorage('kanban')}
          >
            <ViewColumnsIcon className='w-4 h-4 mr-2' />
            {t('view.kanban')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value='cards'>
          <OverviewCards
            language={language}
            invoices={invoices}
            expenses={expenses}
          />
        </TabsContent>
        <TabsContent value='kanban'>
          <OverviewKanban
            language={language}
            invoices={invoices}
            expenses={expenses}
          />
        </TabsContent>
      </Tabs>
    </section>
  )
}
