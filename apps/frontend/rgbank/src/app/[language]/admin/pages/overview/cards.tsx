'use client'

import { fontJetBrainsMono } from '@/app/fonts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExpenseStatusBadge } from '@/components/ui/expense-badge'
import { Input } from '@/components/ui/input'
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
import { FunnelIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { type Dispatch, type SetStateAction, useState } from 'react'

interface Props {
  language: LanguageCode
  invoices: InvoiceResponse[]
  expenses: ExpenseResponse[]
}

export default function OverviewCards({
  language,
  invoices,
  expenses,
}: Props) {
  const [invoiceSearch, setInvoiceSearch] = useState('')
  const [expenseSearch, setExpenseSearch] = useState('')
  const [invoiceFilters, setInvoiceFilters] =
    useState<ExpenseStatus[]>(EXPENSE_STATUS_LIST)
  const [expenseFilters, setExpenseFilters] =
    useState<ExpenseStatus[]>(EXPENSE_STATUS_LIST)
  return (
    <div className='flex flex-col gap-4'>
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>

        <CardContent className='space-y-4'>
          <Input
            placeholder='Search'
            value={invoiceSearch}
            onChange={(e) => setInvoiceSearch(e.target.value)}
          />
          <div className='flex gap-4 mb-2'>
            <div className='space-y-2 overflow-hidden'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={'outline'} className='space-x-2'>
                    <FunnelIcon className='h-4 w-4' />
                    <p>Filters</p>
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
                      Select the status you want to filter by
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
                          <ExpenseStatusBadge status={status.value} />
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
                  <TableHead className='pl-7'>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices
                  .filter((invoice) => {
                    if (invoiceSearch === '') return true
                    const combinedString = `${invoice.invoice_id} ${invoice.status} ${invoice.student?.first_name} ${invoice.student?.last_name}`
                    return combinedString
                      .toLowerCase()
                      .includes(invoiceSearch.toLowerCase())
                  })
                  .filter((invoice) => {
                    if (invoiceFilters.length === 0) return true
                    return invoiceFilters.includes(invoice.status)
                  })
                  .map((invoice) => (
                    <TableRow key={invoice.invoice_id}>
                      <TableCell
                        className={`${fontJetBrainsMono.className} font-mono`}
                      >
                        <Button variant={'link'} asChild>
                          <Link
                            href={`/${language}/invoice/${invoice.invoice_id}`}
                          >
                            {invoice.invoice_id}
                          </Link>
                        </Button>
                      </TableCell>
                      <TableCell>
                        <ExpenseStatusBadge status={invoice.status} />
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
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>

        <CardContent className='space-y-4'>
          <Input
            placeholder='Search'
            value={expenseSearch}
            onChange={(e) => setExpenseSearch(e.target.value)}
          />
          <div className='flex flex-col gap-4 mb-2'>
            <div className='space-y-2 overflow-hidden'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={'outline'} className='space-x-2'>
                    <FunnelIcon className='h-4 w-4' />
                    <p>Filters</p>
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
                      Select the status you want to filter by
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
                          <ExpenseStatusBadge status={status.value} />
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
                  <TableHead className='pl-7'>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses
                  .filter((expense) => {
                    if (expenseSearch === '') return true
                    const combinedString = `${expense.expense_id} ${expense.status} ${expense.student?.first_name} ${expense.student?.last_name}`
                    return combinedString
                      .toLowerCase()
                      .includes(expenseSearch.toLowerCase())
                  })
                  .filter((expense) => {
                    if (expenseFilters.length === 0) return true
                    return expenseFilters.includes(expense.status)
                  })
                  .map((expense) => (
                    <TableRow key={expense.expense_id}>
                      <TableCell
                        className={`${fontJetBrainsMono.className} font-mono`}
                      >
                        <Button variant={'link'} asChild>
                          <Link
                            href={`/${language}/expense/${expense.expense_id}`}
                          >
                            {expense.expense_id}
                          </Link>
                        </Button>
                      </TableCell>
                      <TableCell>
                        <ExpenseStatusBadge status={expense.status} />
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
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
