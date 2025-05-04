'use client'

import ActivityFilters from '@/app/[language]/account/pages/activity/components/filter'
import TableLoading from '@/app/[language]/account/pages/activity/components/tableLoading'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'
import { EXPENSE_STATUS_LIST, type ExpenseStatus } from '@/models/General'
import type { InvoiceResponse } from '@/models/Invoice'
import type { LanguageCode } from '@/models/Language'
import { Link } from 'next-view-transitions'
import { useState } from 'react'

interface Props {
  language: LanguageCode
  invoices: InvoiceResponse[]
  invoicesLoading?: boolean
}

export default function ActivityInvoices({
  language,
  invoices,
  invoicesLoading,
}: Props) {
  const { t } = useTranslation(language, 'account')
  const { t: invoiceT } = useTranslation(language, 'invoice')
  const { t: activitiesT } = useTranslation(language, 'activities')

  const [invoiceFilters, setInvoiceFilters] =
    useState<ExpenseStatus[]>(EXPENSE_STATUS_LIST)

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/rgbank/invoices/${invoiceId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      toast({
        title: t('activity.delete.success', {
          type: invoiceT('invoice').toLowerCase(),
        }),
        description: t('activity.delete.successDescription', {
          type: invoiceT('invoice').toLowerCase(),
        }),
      })

      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Error deleting expense:', error)
      toast({
        title: t('activity.delete.error', {
          type: invoiceT('invoice').toLowerCase(),
        }),
        description: t('activity.delete.errorDescription', {
          type: invoiceT('invoice').toLowerCase(),
          error: (error as Error).message,
        }),
        variant: 'destructive',
      })
    }
  }

  if (!invoices || invoices.length === 0 || !Array.isArray(invoices)) {
    return <></>
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>{invoiceT('invoice')}</CardTitle>
        <CardDescription>
          {t('activity.totalInvoices', {
            count: invoices.length,
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ActivityFilters
          language={language}
          setFilters={setInvoiceFilters}
          filters={invoiceFilters}
        />
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='pl-7 w-36'>
                  {activitiesT('activity.table.title')}
                </TableHead>
                <TableHead>{activitiesT('activity.table.createdAt')}</TableHead>
                <TableHead>{activitiesT('activity.table.status')}</TableHead>
                <TableHead>{activitiesT('activity.table.amount')}</TableHead>
                <TableHead className='text-right'>
                  {activitiesT('activity.table.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoicesLoading && <TableLoading />}

              {!invoicesLoading &&
                invoices
                  ?.filter((invoice) => invoiceFilters.includes(invoice.status))
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
                          <Button
                            variant='destructive'
                            size='sm'
                            onClick={() =>
                              handleDeleteInvoice(invoice.invoice_id)
                            }
                          >
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
  )
}
