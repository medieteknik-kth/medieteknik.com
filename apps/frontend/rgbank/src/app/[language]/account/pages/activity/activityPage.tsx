'use client'

import { fontJetBrainsMono } from '@/app/fonts'
import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ExpenseStatusBadge } from '@/components/ui/expense-badge'
import Loading from '@/components/ui/loading'
import { NumberTicker } from '@/components/ui/number-ticker'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ExpenseResponse } from '@/models/Expense'
import {
  EXPENSE_STATUS_LIST,
  type ExpenseStatus,
  availableStatuses,
} from '@/models/General'
import type { InvoiceResponse } from '@/models/Invoice'
import type { LanguageCode } from '@/models/Language'
import { useStudent } from '@/providers/AuthenticationProvider'
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ArrowsUpDownIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import { isSameMonth, subMonths } from 'date-fns'
import { Link } from 'next-view-transitions'
import { useState } from 'react'
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
  const { t: expenseT } = useTranslation(language, 'expense')
  const { t: invoiceT } = useTranslation(language, 'invoice')
  const { t: activitiesT } = useTranslation(language, 'activities')

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

  const [invoiceFilters, setInvoiceFilters] =
    useState<ExpenseStatus[]>(EXPENSE_STATUS_LIST)
  const [expenseFilters, setExpenseFilters] =
    useState<ExpenseStatus[]>(EXPENSE_STATUS_LIST)

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

  // Calculate sums in a single pass for each array
  const now = new Date()
  const prevMonth = subMonths(now, 1)

  let totalExpenditure = 0
  let currentMonthSum = 0
  let previousMonthSum = 0

  // Process all expenses in one loop
  for (const expense of allExpenses) {
    const isPaidOrBooked =
      expense.status === 'PAID' || expense.status === 'BOOKED'
    const amount = expense.amount || 0

    if (isPaidOrBooked) {
      totalExpenditure += amount

      const createdDate = new Date(expense.created_at)
      if (isSameMonth(createdDate, now)) {
        currentMonthSum += amount
      } else if (isSameMonth(createdDate, prevMonth)) {
        previousMonthSum += amount
      }
    }
  }

  // Process all invoices in one loop
  for (const invoice of allInvoices) {
    const isPaidOrBooked =
      invoice.status === 'PAID' || invoice.status === 'BOOKED'
    const amount = invoice.amount || 0

    if (isPaidOrBooked) {
      totalExpenditure += amount

      const createdDate = new Date(invoice.created_at)
      if (isSameMonth(createdDate, now)) {
        currentMonthSum += amount
      } else if (isSameMonth(createdDate, prevMonth)) {
        previousMonthSum += amount
      }
    }
  }

  const percentageChange =
    previousMonthSum !== 0
      ? ((currentMonthSum - previousMonthSum) / previousMonthSum) * 100
      : 100

  const noChange = percentageChange === 0
  const isPositiveChange = percentageChange < 0

  const percentageChangeFormatted = percentageChange.toLocaleString(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const specialNumbers = [
    42, 420, 666, 3_141, 8_008, 13_337, 420_69, 123_456, 666_666, 777_777,
    999_999,
  ]
  const benchmarkNumbers = [
    500, 1_000, 5_000, 10_000, 50_000, 100_000, 500_000, 1_000_000, 10_000_000,
  ]

  const randomNumber = Math.floor(Math.random() * 3) + 1

  return (
    <section className='w-full h-fit max-w-[1100px] mb-8 2xl:mb-0'>
      <div className='w-full flex flex-col gap-4 h-fit'>
        <div className='-full px-4 pt-4'>
          <h2 className='text-lg font-bold'>{t('activity.title')}</h2>
          <p className='text-sm text-muted-foreground'>
            {t('activity.description')}
          </p>
          <Separator className='bg-yellow-400 mt-4' />
        </div>

        <div className='grid gap-4 grid-cols-2 mx-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>
                {t('activity.total_expenditure')}
              </CardDescription>
              <CardTitle className='text-4xl flex items-center'>
                <span className='text-2xl mr-2 text-muted-foreground select-none'>
                  SEK
                </span>
                <NumberTicker
                  value={totalExpenditure}
                  decimalPlaces={2}
                  language={language}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-sm text-muted-foreground'>
                {/* TODO: Add flavor text? */}
                {specialNumbers.includes(totalExpenditure) ? (
                  <span className='text-yellow-500'>
                    {t(`activity.total_expenditure.quip.${totalExpenditure}.1`)}
                  </span>
                ) : (
                  <span className='text-muted-foreground italic'>
                    {t(
                      `activity.total_expenditure.quip.below_${benchmarkNumbers.find(
                        (num) => totalExpenditure <= num
                      )}.${randomNumber}`
                    )}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>{t('activity.current_month')}</CardDescription>
              <CardTitle className='text-4xl flex items-center'>
                <span className='text-2xl mr-2 text-muted-foreground select-none'>
                  SEK
                </span>
                <NumberTicker
                  value={currentMonthSum}
                  decimalPlaces={2}
                  language={language}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center text-sm gap-2'>
                {noChange ? (
                  <ArrowsUpDownIcon className='h-4 w-4 text-yellow-500' />
                ) : isPositiveChange ? (
                  <ArrowTrendingDownIcon className='h-4 w-4 text-green-500' />
                ) : (
                  <ArrowTrendingUpIcon className='h-4 w-4 text-red-500' />
                )}
                <span
                  className={
                    noChange
                      ? 'text-yellow-500'
                      : isPositiveChange
                        ? 'text-green-500'
                        : 'text-red-500'
                  }
                >
                  <span>{percentageChangeFormatted} % </span>
                  {t('activity.current_month.difference')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='mx-4 space-y-4'>
          {expenses && expenses.length > 0 && (
            <Card className='w-full'>
              <CardHeader>
                <CardTitle>{expenseT('expense')}</CardTitle>
                <CardDescription>
                  {t('activity.totalExpenses', {
                    count: expenses.length,
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col gap-4 mb-2'>
                  <div className='space-y-2 overflow-hidden'>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={'outline'} className='space-x-2'>
                          <FunnelIcon className='h-4 w-4' />
                          <p>{activitiesT('activity.filter.title')}</p>
                          {Math.abs(6 - expenseFilters.length) > 0 && (
                            <span className='text-xs text-muted-foreground'>
                              {Math.abs(6 - expenseFilters.length)}
                              {expenseFilters.length < 5
                                ? ' filters'
                                : ' filter'}
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className='flex flex-col gap-2'>
                          <div className='text-sm text-muted-foreground'>
                            {activitiesT('activity.filter.description')}
                          </div>
                          <div className='grid grid-cols-2 gap-2'>
                            {availableStatuses.map((status) => (
                              <Button
                                key={status.value}
                                variant={'outline'}
                                size='sm'
                                className={`${
                                  !expenseFilters.includes(status.value)
                                    ? 'grayscale-100'
                                    : ''
                                }`}
                                onClick={() => {
                                  setExpenseFilters((prev) =>
                                    prev.includes(status.value)
                                      ? prev.filter((s) => s !== status.value)
                                      : [...prev, status.value]
                                  )
                                }}
                              >
                                <ExpenseStatusBadge
                                  language={language}
                                  status={status.value}
                                />
                              </Button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className='rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='pl-7 w-36'>
                          {activitiesT('activity.table.title')}
                        </TableHead>
                        <TableHead>
                          {activitiesT('activity.table.createdAt')}
                        </TableHead>
                        <TableHead>
                          {activitiesT('activity.table.status')}
                        </TableHead>
                        <TableHead>
                          {activitiesT('activity.table.amount')}
                        </TableHead>
                        <TableHead className='text-right'>
                          {activitiesT('activity.table.actions')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expensesLoading &&
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={crypto.randomUUID()}>
                            <TableCell>
                              <Skeleton className='h-4 w-96' />
                            </TableCell>
                            <TableCell>
                              <Skeleton className='h-4 w-44' />
                            </TableCell>
                            <TableCell>
                              <Skeleton className='h-4 w-32' />
                            </TableCell>
                            <TableCell>
                              <Skeleton className='h-4 w-44' />
                            </TableCell>
                            <TableCell>
                              <Skeleton className='h-4 w-24' />
                            </TableCell>
                          </TableRow>
                        ))}

                      {!expensesLoading &&
                        expenses
                          ?.filter((expense) =>
                            expenseFilters.includes(expense.status)
                          )
                          .map((expense) => (
                            <TableRow key={expense.expense_id}>
                              <TableCell
                                className={`${fontJetBrainsMono.className} font-mono`}
                              >
                                <Button variant='link' size='sm' asChild>
                                  <Link
                                    href={`/${language}/expense/${expense.expense_id}`}
                                  >
                                    <p
                                      className='max-w-36 truncate'
                                      title={expense.title}
                                    >
                                      {expense.title}
                                    </p>
                                  </Link>
                                </Button>
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  expense.created_at
                                ).toLocaleDateString(language, {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                })}
                              </TableCell>
                              <TableCell>
                                <ExpenseStatusBadge
                                  language={language}
                                  status={expense.status}
                                />
                              </TableCell>
                              <TableCell>
                                {expense.amount?.toLocaleString(language, {
                                  style: 'currency',
                                  currency: 'SEK',
                                })}
                              </TableCell>
                              <TableCell className='text-right space-x-2'>
                                <Button variant='outline' size='sm' asChild>
                                  <Link
                                    href={`/${language}/expense/${expense.expense_id}`}
                                  >
                                    {activitiesT('activity.table.actions.view')}
                                  </Link>
                                </Button>
                                {expense.status === 'UNCONFIRMED' && (
                                  <Button variant='destructive' size='sm'>
                                    {activitiesT(
                                      'activity.table.actions.delete'
                                    )}
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {invoices && invoices.length > 0 && (
            <Card className='w-full'>
              <CardHeader>
                <CardTitle>{invoiceT('invoice')}</CardTitle>
                <CardDescription>
                  {t('activity.totalInvoices', {
                    count: expenses.length,
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col gap-4 mb-2'>
                  <div className='space-y-2 overflow-hidden'>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={'outline'} className='space-x-2'>
                          <FunnelIcon className='h-4 w-4' />
                          <p>{activitiesT('activity.filter.title')}</p>
                          {Math.abs(6 - invoiceFilters.length) > 0 && (
                            <span className='text-xs text-muted-foreground'>
                              {Math.abs(6 - invoiceFilters.length)}
                              {invoiceFilters.length < 5
                                ? ' filters'
                                : ' filter'}
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className='flex flex-col gap-2'>
                          <div className='text-sm text-muted-foreground'>
                            {activitiesT('activity.filter.description')}
                          </div>
                          <div className='grid grid-cols-2 gap-2'>
                            {availableStatuses.map((status) => (
                              <Button
                                key={status.value}
                                variant={'outline'}
                                size='sm'
                                className={`${
                                  !invoiceFilters.includes(status.value)
                                    ? 'grayscale-100'
                                    : ''
                                }`}
                                onClick={() => {
                                  setInvoiceFilters((prev) =>
                                    prev.includes(status.value)
                                      ? prev.filter((s) => s !== status.value)
                                      : [...prev, status.value]
                                  )
                                }}
                              >
                                <ExpenseStatusBadge
                                  language={language}
                                  status={status.value}
                                />
                              </Button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className='rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='pl-7 w-36'>
                          {activitiesT('activity.table.title')}
                        </TableHead>
                        <TableHead>
                          {activitiesT('activity.table.createdAt')}
                        </TableHead>
                        <TableHead>
                          {activitiesT('activity.table.status')}
                        </TableHead>
                        <TableHead>
                          {activitiesT('activity.table.amount')}
                        </TableHead>
                        <TableHead className='text-right'>
                          {activitiesT('activity.table.actions')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices
                        ?.filter((invoice) =>
                          invoiceFilters.includes(invoice.status)
                        )
                        .map((invoice) => (
                          <TableRow key={invoice.invoice_id}>
                            <TableCell
                              className={`${fontJetBrainsMono.className} font-mono`}
                            >
                              <Button variant='link' size='sm' asChild>
                                <Link
                                  href={`/${language}/invoice/${invoice.invoice_id}`}
                                >
                                  <p
                                    className='max-w-36 truncate'
                                    title={invoice.title}
                                  >
                                    {invoice.title}
                                  </p>
                                </Link>
                              </Button>
                            </TableCell>
                            <TableCell>
                              {new Date(invoice.created_at).toLocaleDateString(
                                language,
                                {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                }
                              )}
                            </TableCell>
                            <TableCell>
                              <ExpenseStatusBadge
                                language={language}
                                status={invoice.status}
                              />
                            </TableCell>
                            <TableCell>
                              {invoice.amount?.toLocaleString(language, {
                                style: 'currency',
                                currency: 'SEK',
                              })}
                            </TableCell>
                            <TableCell className='text-right space-x-2'>
                              <Button variant='outline' size='sm' asChild>
                                <Link
                                  href={`/${language}/invoice/${invoice.invoice_id}`}
                                >
                                  {activitiesT('activity.table.actions.view')}
                                </Link>
                              </Button>
                              {invoice.status === 'UNCONFIRMED' && (
                                <Button variant='destructive' size='sm'>
                                  {activitiesT('activity.table.actions.delete')}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
