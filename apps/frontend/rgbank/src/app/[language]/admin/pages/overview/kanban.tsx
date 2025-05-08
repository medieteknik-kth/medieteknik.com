'use client'

import ExpenseCard from '@/app/[language]/admin/pages/overview/components/expenseCard'
import InvoiceCard from '@/app/[language]/admin/pages/overview/components/invoiceCard'
import { useTranslation } from '@/app/i18n/client'
import { PopIn } from '@/components/animation/pop-in'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExpenseBadge } from '@/components/ui/expense-badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import type { ExpenseResponse } from '@/models/Expense'
import type { InvoiceResponse } from '@/models/Invoice'
import { sortByCreatedAt } from '@/utility/sortUtils'
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { useState } from 'react'

interface Props {
  language: LanguageCode
  invoices: InvoiceResponse[]
  expenses: ExpenseResponse[]
}

type CombinedEntry =
  | (InvoiceResponse & { type: 'invoice' })
  | (ExpenseResponse & { type: 'expense' })

export default function OverviewKanban({
  language,
  invoices,
  expenses,
}: Props) {
  const [typeFilter, setTypeFilter] = useState<('invoice' | 'expense')[]>([
    'invoice',
    'expense',
  ])
  const [shortCards, setShortCards] = useState(false)
  const { t } = useTranslation(language, 'activities')

  const combined: CombinedEntry[] = [
    ...invoices.map((i) => ({ ...i, type: 'invoice' as const })),
    ...expenses.map((e) => ({ ...e, type: 'expense' as const })),
  ]

  const sortedCombined = sortByCreatedAt(combined)

  return (
    <div className='max-w-[100rem] overflow-hidden space-y-4'>
      <div className='mx-4 flex items-center gap-4'>
        <Button
          variant={'outline'}
          onClick={() => setShortCards((prev) => !prev)}
        >
          {shortCards ? t('activity.view.full') : t('activity.view.short')}
        </Button>

        <Button
          variant={'outline'}
          className='space-x-2'
          onClick={() => {
            if (typeFilter.includes('expense')) {
              setTypeFilter((prev) => prev.filter((t) => t !== 'expense'))
            } else {
              setTypeFilter((prev) => [...prev, 'expense'])
            }
          }}
        >
          {typeFilter.includes('expense') ? (
            <CheckCircleIcon className='h-5 w-5 text-green-400' />
          ) : (
            <XMarkIcon className='h-5 w-5 text-red-400' />
          )}
          <ExpenseBadge language={language} type={'expense'} />
        </Button>

        <Button
          variant={'outline'}
          className='space-x-2'
          onClick={() => {
            if (typeFilter.includes('invoice')) {
              setTypeFilter((prev) => prev.filter((t) => t !== 'invoice'))
            } else {
              setTypeFilter((prev) => [...prev, 'invoice'])
            }
          }}
        >
          {typeFilter.includes('invoice') ? (
            <CheckCircleIcon className='h-5 w-5 text-green-400' />
          ) : (
            <XMarkIcon className='h-5 w-5 text-red-400' />
          )}
          <ExpenseBadge language={language} type={'invoice'} />
        </Button>
      </div>
      <ScrollArea className='w-[calc(100vw-2rem)] md:w-[calc(100vw-20rem)] pb-10'>
        <div className='flex w-max gap-5'>
          <div className='flex flex-col gap-4 min-w-80 w-full pl-4 pb-4'>
            <div className='flex items-center gap-2'>
              <h3 className='text-lg tracking-wide font-semibold'>
                {t('activity.table.status.new')}
              </h3>
              <Badge variant={'outline'}>
                {
                  sortedCombined.filter(
                    (entry) => entry.status === 'UNCONFIRMED'
                  ).length
                }
              </Badge>
            </div>

            <div className='flex flex-col gap-4'>
              {sortedCombined
                .filter((entry) => entry.status === 'UNCONFIRMED')
                .map((entry) => {
                  if (entry.type === 'expense') {
                    if (!typeFilter.includes('expense')) return null
                    return (
                      <PopIn key={entry.expense_id}>
                        <ExpenseCard
                          language={language}
                          expense={entry}
                          short={shortCards}
                        />
                      </PopIn>
                    )
                  }
                  if (!typeFilter.includes('invoice')) return null
                  return (
                    <PopIn key={entry.invoice_id}>
                      <InvoiceCard
                        language={language}
                        invoice={entry}
                        short={shortCards}
                      />
                    </PopIn>
                  )
                })}
            </div>
          </div>

          <Separator orientation='vertical' className='h-[calc(100vh-4rem)]' />

          <div className='flex flex-col gap-4 min-w-80 w-full pb-4'>
            <div className='flex items-center gap-2'>
              <h3 className='text-lg tracking-wide font-semibold'>
                {t('activity.table.status.pending')}
              </h3>
              <Badge variant={'outline'}>
                {
                  sortedCombined.filter(
                    (entry) =>
                      entry.status !== 'UNCONFIRMED' &&
                      entry.status !== 'BOOKED'
                  ).length
                }
              </Badge>
            </div>

            <div className='flex flex-col gap-4'>
              {sortedCombined
                .filter(
                  (entry) =>
                    entry.status !== 'UNCONFIRMED' &&
                    entry.status !== 'BOOKED' &&
                    entry.status !== 'REJECTED'
                )
                .map((entry) => {
                  if (entry.type === 'expense') {
                    if (!typeFilter.includes('expense')) return null
                    return (
                      <PopIn key={entry.expense_id}>
                        <ExpenseCard
                          language={language}
                          expense={entry}
                          short={shortCards}
                        />
                      </PopIn>
                    )
                  }
                  if (!typeFilter.includes('invoice')) return null
                  return (
                    <PopIn key={entry.invoice_id}>
                      <InvoiceCard
                        language={language}
                        invoice={entry}
                        short={shortCards}
                      />
                    </PopIn>
                  )
                })}
            </div>
          </div>

          <Separator orientation='vertical' className='h-[calc(100vh-4rem)]' />

          <div className='flex flex-col gap-4 min-w-80 w-full pr-36 pb-4'>
            <div className='flex items-center gap-2'>
              <h3 className='text-lg tracking-wide font-semibold'>
                {t('activity.table.status.completed')}
              </h3>
              <Badge variant={'outline'}>
                {
                  sortedCombined.filter((entry) => entry.status === 'BOOKED')
                    .length
                }
              </Badge>
            </div>
            <div className='flex flex-col gap-4'>
              {sortedCombined
                .filter(
                  (entry) =>
                    entry.status === 'BOOKED' || entry.status === 'REJECTED'
                )
                .map((entry) => {
                  if (entry.type === 'expense') {
                    if (!typeFilter.includes('expense')) return null
                    return (
                      <PopIn key={entry.expense_id}>
                        <ExpenseCard
                          language={language}
                          expense={entry}
                          short={shortCards}
                        />
                      </PopIn>
                    )
                  }
                  if (!typeFilter.includes('invoice')) return null
                  return (
                    <PopIn key={entry.invoice_id}>
                      <InvoiceCard
                        language={language}
                        invoice={entry}
                        short={shortCards}
                      />
                    </PopIn>
                  )
                })}
            </div>
          </div>
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </div>
  )
}
