'use client'

import ActivityOverview from '@/app/[language]/account/pages/activity/components/overview'
import ActivityExpenses from '@/app/[language]/account/pages/activity/expenses'
import ActivityInvoices from '@/app/[language]/account/pages/activity/invoices'
import { useTranslation } from '@/app/i18n/client'
import { Loading } from '@/components/ui'
import { Separator } from '@/components/ui/separator'
import type { ExpenseResponse } from '@/models/Expense'
import type { InvoiceResponse } from '@/models/Invoice'
import { useStudent } from '@/providers/AuthenticationProvider'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import useSWR from 'swr'

interface Props {
  language: LanguageCode
  expenses?: ExpenseResponse[]
  invoices?: InvoiceResponse[]
}

const fetcher = (url: string) =>
  fetch(url, {
    credentials: 'include',
  }).then((res) => res.json())

export default function ActivityPage({ language }: Props) {
  const { student } = useStudent()
  const {
    data: expenses,
    isLoading: expensesLoading,
    error: expenseError,
  } = useSWR<ExpenseResponse[]>(
    student ? `/api/rgbank/expenses/student/${student.student_id}` : null,
    fetcher,
    {
      fallbackData: [],
    }
  )
  const { t } = useTranslation(language, 'account')
  const { t: errors } = useTranslation(language, 'errors')

  const {
    data: invoices,
    isLoading: invoicesLoading,
    error: invoiceError,
  } = useSWR<InvoiceResponse[]>(
    student ? `/api/rgbank/invoices/student/${student.student_id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      fallbackData: [],
    }
  )

  const allExpenses = expenses || []
  const allInvoices = invoices || []

  if (invoiceError || expenseError) {
    return <div>{errors('invoiceOrExpense.notFound')}</div>
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
    <section className='w-full h-fit max-w-[1100px] mb-8 2xl:mb-0 flex flex-col gap-4'>
      <div className='w-full px-4'>
        <h2 className='text-lg font-bold'>{t('activity.title')}</h2>
        <p className='text-sm text-muted-foreground'>
          {t('activity.description')}
        </p>
        <Separator className='bg-yellow-400 mt-4' />
      </div>

      <ActivityOverview
        language={language}
        allExpenses={allExpenses}
        allInvoices={allInvoices}
      />

      <div className='mx-4 space-y-4'>
        <ActivityExpenses
          language={language}
          expenses={expenses}
          expensesLoading={expensesLoading}
        />

        <ActivityInvoices
          language={language}
          invoices={invoices}
          invoicesLoading={invoicesLoading}
        />
      </div>
    </section>
  )
}
