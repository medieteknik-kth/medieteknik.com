'use client'

import { useTranslation } from '@/app/i18n/client'
import { Badge, Label } from '@/components/ui'
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
import {
  CalendarIcon,
  HashtagIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import Image from 'next/image'

interface Props {
  language: LanguageCode
  invoice?: InvoiceResponse
  expense?: ExpenseResponse
}

export default function DetailsSection({ language, invoice, expense }: Props) {
  const { t } = useTranslation(language, 'processing')

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
      <div className='grid md:grid-cols-2 gap-4'>
        <div>
          <h3 className='text-sm font-medium text-muted-foreground'>
            {t('details.type')}
          </h3>
          {expense ? (
            <ExpenseBadge language={language} type='expense' className='mt-1' />
          ) : (
            <ExpenseBadge language={language} type='invoice' className='mt-1' />
          )}
        </div>
        <div>
          <h3 className='text-sm font-medium text-muted-foreground'>
            {t('details.amount')}
          </h3>
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
                {t('details.invoice.date')}
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
                {t('details.invoice.dueDate')}
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
                {t('details.expense.date')}
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
          {t('details.description.label')}
        </h3>
        <p className='mt-1'>{item.description}</p>
      </div>
      {item.status === 'BOOKED' && item.booked_item && (
        <>
          <Separator />
          <div className='space-y-2  rounded-b-lg'>
            <Label className='text-sm font-medium text-muted-foreground'>
              {t('details.verification.label')}
            </Label>
            <div className='flex items-center gap-2 text-sm'>
              <HashtagIcon className='h-5 w-5 text-muted-foreground' />
              {item.booked_item.verification_number}
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <CalendarIcon className='h-5 w-5 text-muted-foreground' />
              {new Date(`${item.booked_item.paid_at}Z`).toLocaleString(
                language,
                {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )}
            </div>
            <div className='flex items-center gap-2'>
              <UserIcon className='h-5 w-5 text-muted-foreground' />
              <div className='flex items-center gap-2'>
                {item.booked_item.student.profile_picture_url ? (
                  <Image
                    src={item.booked_item.student.profile_picture_url}
                    alt='Profile Picture'
                    width={24}
                    height={24}
                    className='rounded-full'
                  />
                ) : (
                  <div>
                    {item.booked_item.student.first_name.charAt(0)}{' '}
                    {item.booked_item.student.last_name?.charAt(0)}
                  </div>
                )}
                <span className='text-sm font-medium'>
                  {item.booked_item.student.first_name}{' '}
                  {item.booked_item.student.last_name}
                </span>
              </div>

              <Badge
                variant='outline'
                className='ml-2 text-xs font-normal bg-background'
              >
                {item.booked_item.committee_position.translations[0].title}
              </Badge>
            </div>
          </div>
        </>
      )}
      <Separator />
      <div>
        <h3 className='text-sm font-medium text-muted-foreground'>
          {t('details.categories')}
        </h3>
        <div className='mt-1'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('details.categories.domain')}</TableHead>
                <TableHead>{t('details.categories.category')}</TableHead>
                <TableHead className='text-right'>
                  {t('details.categories.amount')}
                </TableHead>
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
