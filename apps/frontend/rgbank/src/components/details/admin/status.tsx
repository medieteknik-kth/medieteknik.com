'use client'

import { useTranslation } from '@/app/i18n/client'
import { Input } from '@/components/ui'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ExpenseStatusBadge } from '@/components/ui/expense-badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { ExpenseResponse } from '@/models/Expense'
import {
  EXPENSE_STATUS_VALUES,
  type ExpenseStatus,
  availableStatuses,
} from '@/models/General'
import type { InvoiceResponse } from '@/models/Invoice'
import { useGeneralDetail } from '@/providers/DetailProvider'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { useState } from 'react'
import { mutate } from 'swr'

interface Props {
  language: LanguageCode
  item: InvoiceResponse | ExpenseResponse
  updateStatus: (status: ExpenseStatus) => void
}

export default function AdminStatusSection({
  language,
  item,
  updateStatus,
}: Props) {
  const { addMessage } = useGeneralDetail()
  const [selectedStatus, setSelectedStatus] = useState('')
  const [comment, setComment] = useState('')
  const [verificationNumber, setVerificationNumber] = useState('')
  const { t } = useTranslation(language, 'processing')
  const { t: expenseT } = useTranslation(language, 'expense')
  const { t: invoiceT } = useTranslation(language, 'invoice')
  const isInvoice = 'invoice_id' in item

  const handleStatusChange = async (status: ExpenseStatus) => {
    const url = isInvoice
      ? `/api/rgbank/invoices/${item.invoice_id}/status`
      : `/api/rgbank/expenses/${item.expense_id}/status`
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          comment,
          verification_number:
            status === 'BOOKED' ? verificationNumber : undefined,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      updateStatus(status)
      addMessage({
        message_type: 'SYSTEM',
        previous_status: item.status,
        new_status: status,
        content: comment,
        created_at: new Date().toISOString(),
        message_id: crypto.randomUUID(),
      })

      if (isInvoice) {
        mutate(`/api/rgbank/invoices/${item.invoice_id}`)
      } else {
        mutate(`/api/rgbank/expenses/${item.expense_id}`)
      }

      setComment('')
      setSelectedStatus('')
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.status.title')}</CardTitle>
        <CardDescription>
          {t('admin.status.description', {
            type: isInvoice ? invoiceT('invoice') : expenseT('expense'),
          })}

          <br />
          <span className='text-xs text-muted-foreground'>
            {t('admin.status.note')}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex gap-2'>
          {t('admin.status.current')}
          <ExpenseStatusBadge language={language} status={item.status} />
        </div>
        <form
          id='status-form'
          className='space-y-4'
          onSubmit={() => {
            handleStatusChange(selectedStatus)
          }}
        >
          <div className='space-y-2'>
            <Label htmlFor='status'>{t('admin.status.new.label')}</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger
                id='status'
                className='cursor-pointer'
                title={t('admin.status.new.label')}
              >
                <SelectValue placeholder={t('admin.status.new.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => (
                  <SelectItem
                    key={status.value}
                    value={status.value}
                    disabled={
                      EXPENSE_STATUS_VALUES[
                        item.status as keyof typeof EXPENSE_STATUS_VALUES
                      ] >=
                      EXPENSE_STATUS_VALUES[
                        status.value as keyof typeof EXPENSE_STATUS_VALUES
                      ]
                    }
                  >
                    <div className='flex items-center gap-2'>
                      <ExpenseStatusBadge
                        language={language}
                        status={status.value}
                      />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStatus && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <ExpenseStatusBadge language={language} status={item.status} />
              <ArrowRightIcon className='h-4 w-4' />
              <ExpenseStatusBadge language={language} status={selectedStatus} />
            </div>
          )}

          {selectedStatus === 'BOOKED' && (
            <>
              <Label htmlFor='verification_number'>
                {t('admin.status.verification_number.label')}
              </Label>
              <Input
                id='verification_number'
                name='verification_number'
                placeholder={t('admin.status.verification_number.placeholder')}
                value={verificationNumber}
                onChange={(e) => setVerificationNumber(e.target.value)}
              />
            </>
          )}

          <div className='space-y-2'>
            <Label htmlFor='comment'>
              {t('admin.status.comment')}
              {(selectedStatus === 'REJECTED' ||
                selectedStatus === 'CLARIFICATION') && (
                <span className='text-destructive'>*</span>
              )}
            </Label>
            <Textarea
              id='comment'
              name='comment'
              placeholder={
                selectedStatus === 'REJECTED'
                  ? t('admin.status.rejected.comment')
                  : selectedStatus === 'CLARIFICATION'
                    ? t('admin.status.clarification.comment')
                    : t('admin.status.optional.comment')
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className='min-h-[100px]'
            />
            {selectedStatus === 'REJECTED' && (
              <p className='text-xs text-muted-foreground'>
                {t('admin.status.rejected.comment.note')}
              </p>
            )}
            {selectedStatus === 'CLARIFICATION' && (
              <p className='text-xs text-muted-foreground'>
                {t('admin.status.clarification.comment.note')}
              </p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type='submit'
          form='status-form'
          title={
            selectedStatus === 'REJECTED' || selectedStatus === 'BOOKED'
              ? t('admin.status.close')
              : t('admin.status.update')
          }
          onClick={(e) => {
            e.preventDefault()
            if (selectedStatus === 'REJECTED' && comment.length === 0) {
              alert(t('admin.status.rejected.comment'))
              return
            }
            handleStatusChange(selectedStatus)
          }}
          disabled={
            (selectedStatus === 'REJECTED' && comment.length === 0) ||
            (selectedStatus === 'CLARIFICATION' && comment.length === 0) ||
            (selectedStatus === 'BOOKED' && verificationNumber.length === 0) ||
            !selectedStatus
          }
        >
          {selectedStatus === 'REJECTED' || selectedStatus === 'BOOKED'
            ? t('admin.status.close')
            : t('admin.status.update')}
        </Button>
      </CardFooter>
    </Card>
  )
}
