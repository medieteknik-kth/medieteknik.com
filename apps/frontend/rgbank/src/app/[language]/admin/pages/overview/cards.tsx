'use client'

import { fontJetBrainsMono } from '@/app/fonts'
import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExpenseStatusBadge } from '@/components/ui/expense-badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
import { filterExpense, filterInvoice } from '@/utility/expense/filterUtils'
import { FunnelIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
  language: LanguageCode
  invoices: InvoiceResponse[]
  expenses: ExpenseResponse[]
}

export default function OverviewCards({ language, invoices, expenses }: Props) {
  const [invoiceSearch, setInvoiceSearch] = useState('')
  const [expenseSearch, setExpenseSearch] = useState('')
  const [invoiceFilters, setInvoiceFilters] =
    useState<ExpenseStatus[]>(EXPENSE_STATUS_LIST)
  const [expenseFilters, setExpenseFilters] =
    useState<ExpenseStatus[]>(EXPENSE_STATUS_LIST)
  const { t } = useTranslation(language, 'activities')
  const { t: expenseT } = useTranslation(language, 'expense')
  const { t: invoiceT } = useTranslation(language, 'invoice')

  return (
    <div className='space-y-4'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>{expenseT('expense')}</CardTitle>
        </CardHeader>

        <CardContent className='space-y-4'>
          <div>
            <Label
              htmlFor='expense_search'
              className='text-sm font-medium text-muted-foreground'
            >
              {t('activity.filter.search.label')}
            </Label>
            <Input
              id='expense_search'
              placeholder={t('activity.filter.search.placeholder')}
              value={expenseSearch}
              onChange={(e) => setExpenseSearch(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-4 mb-2'>
            <div className='space-y-2 overflow-hidden'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={'outline'} className='space-x-2'>
                    <FunnelIcon className='h-4 w-4' />
                    <p>{t('activity.filter.title')}</p>
                    {Math.abs(6 - expenseFilters.length) > 0 && (
                      <span className='text-xs text-muted-foreground'>
                        {Math.abs(6 - expenseFilters.length)}
                        {expenseFilters.length < 5 ? ' filters' : ' filter'}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className='flex flex-col gap-2'>
                    <div className='text-sm text-muted-foreground'>
                      {t('activity.filter.description')}
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
                    {t('activity.table.title')}
                  </TableHead>
                  <TableHead>{t('activity.table.status')}</TableHead>
                  <TableHead>{t('activity.table.user')}</TableHead>
                  <TableHead>{t('activity.table.createdAt')}</TableHead>
                  <TableHead>{t('activity.table.amount')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterExpense(expenses, expenseSearch, expenseFilters).map(
                  (expense) => (
                    <TableRow key={expense.expense_id}>
                      <TableCell
                        className={`${fontJetBrainsMono.className} font-mono`}
                      >
                        <Button variant={'link'} asChild>
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
                        <ExpenseStatusBadge
                          language={language}
                          status={expense.status}
                        />
                      </TableCell>
                      {expense.student && (
                        <TableCell>
                          {`${expense.student.first_name} ${expense.student.last_name}`}
                        </TableCell>
                      )}
                      <TableCell>
                        {new Date(expense.created_at).toLocaleString(language)}
                      </TableCell>
                      <TableCell>
                        {expense.amount?.toLocaleString(language, {
                          currency: 'SEK',
                          style: 'currency',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className='w-full'>
        <CardHeader>
          <CardTitle>{invoiceT('invoice')}</CardTitle>
        </CardHeader>

        <CardContent className='space-y-4'>
          <div>
            <Label
              htmlFor='invoice_search'
              className='text-sm font-medium text-muted-foreground'
            >
              {t('activity.filter.search.label')}
            </Label>
            <Input
              id='invoice_search'
              placeholder={t('activity.filter.search.placeholder')}
              value={invoiceSearch}
              onChange={(e) => setInvoiceSearch(e.target.value)}
            />
          </div>
          <div className='flex gap-4 mb-2'>
            <div className='space-y-2 overflow-hidden'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={'outline'} className='space-x-2'>
                    <FunnelIcon className='h-4 w-4' />
                    <p>{t('activity.filter.title')}</p>
                    {Math.abs(6 - invoiceFilters.length) > 0 && (
                      <span className='text-xs text-muted-foreground'>
                        {Math.abs(6 - invoiceFilters.length)}
                        {invoiceFilters.length < 5 ? ' filters' : ' filter'}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className='flex flex-col gap-2'>
                    <div className='text-sm text-muted-foreground'>
                      {t('activity.filter.description')}
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
                    {t('activity.table.title')}
                  </TableHead>
                  <TableHead>{t('activity.table.status')}</TableHead>
                  <TableHead>{t('activity.table.user')}</TableHead>
                  <TableHead>{t('activity.table.createdAt')}</TableHead>
                  <TableHead>{t('activity.table.amount')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterInvoice(invoices, invoiceSearch, invoiceFilters).map(
                  (invoice) => (
                    <TableRow key={invoice.invoice_id}>
                      <TableCell
                        className={`${fontJetBrainsMono.className} font-mono`}
                      >
                        <Button variant={'link'} asChild>
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
                        <ExpenseStatusBadge
                          language={language}
                          status={invoice.status}
                        />
                      </TableCell>
                      {invoice.student && (
                        <TableCell>
                          {`${invoice.student.first_name} ${invoice.student.last_name}`}
                        </TableCell>
                      )}
                      <TableCell>
                        {new Date(invoice.created_at).toLocaleString(language)}
                      </TableCell>
                      <TableCell>
                        {invoice.amount?.toLocaleString(language, {
                          currency: 'SEK',
                          style: 'currency',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
