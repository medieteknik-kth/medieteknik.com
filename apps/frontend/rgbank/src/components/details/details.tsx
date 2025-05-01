'use client'

import { ExpenseBadge } from '@/components/ui/expense-badge'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ExpenseResponse } from '@/models/Expense'
import type { InvoiceResponse } from '@/models/Invoice'
import type { LanguageCode } from '@/models/Language'

interface Props {
  language: LanguageCode
  invoice?: InvoiceResponse
  expense?: ExpenseResponse
}

export default function DetailsSection({ language, invoice, expense }: Props) {
  if (!invoice && !expense) {
    return null
  }

  if (invoice && expense) {
    return null
  }

  const item = invoice ?? expense

  if (!item) {
    return null
  }

  return (
    <section className='flex flex-col gap-4 mt-2'>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <h3 className='text-sm font-medium text-muted-foreground'>Type</h3>
          {expense ? (
            <ExpenseBadge type='expense' className='mt-1' />
          ) : (
            <ExpenseBadge type='invoice' className='mt-1' />
          )}
        </div>
        <div>
          <h3 className='text-sm font-medium text-muted-foreground'>Amount</h3>
          <p className='mt-1 text-lg font-semibold'>
            <span className='text-base text-muted-foreground select-none'>
              SEK
            </span>{' '}
            {item.amount?.toLocaleString(language, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        {invoice ? (
          <>
            <div>
              <h3 className='text-sm font-medium text-muted-foreground'>
                Date Issued
              </h3>
              <p className='mt-1'>
                {new Date(invoice.date_issued).toLocaleDateString(language, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <h3 className='text-sm font-medium text-muted-foreground'>
                Due Date
              </h3>
              <p className='mt-1'>
                {new Date(invoice.due_date).toLocaleDateString(language, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </>
        ) : (
          expense && (
            <div>
              <h3 className='text-sm font-medium text-muted-foreground'>
                Date
              </h3>
              <p className='mt-1'>
                {new Date(expense.date).toLocaleDateString(language, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )
        )}
      </div>
      <Separator />
      <div>
        <h3 className='text-sm font-medium text-muted-foreground'>
          Description
        </h3>
        <p className='mt-1'>{item.description}</p>
      </div>
      <Separator />
      <div>
        <h3 className='text-sm font-medium text-muted-foreground'>
          Categories
        </h3>
        <div className='mt-1'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className='text-right'>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {item.categories?.map((category) => (
                <TableRow key={category.id}>
                  {item.committee ? (
                    <TableCell>
                      {item.committee?.translations[0].title}
                    </TableCell>
                  ) : (
                    <TableCell>{category.author}</TableCell>
                  )}
                  <TableCell>{category.category}</TableCell>
                  <TableCell className='text-right'>
                    SEK{' '}
                    {Number.parseFloat(category.amount).toLocaleString(
                      language,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}
