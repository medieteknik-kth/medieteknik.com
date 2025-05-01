'use client'

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
import type { LanguageCode } from '@/models/Language'
import { useGeneralDetail } from '@/providers/DetailProvider'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
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
        <CardTitle>Update Status</CardTitle>
        <CardDescription>
          Change the status of this {isInvoice ? 'invoice' : 'expense'} to a new
          status and notify the submitter.
          <br />
          <span className='text-xs text-muted-foreground'>
            Note: You can only change the status to a higher value. For example,
            you cannot change the status from 'CONFIRMED' back to 'UNCONFIRMED'.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex gap-2'>
          Current Status:
          <ExpenseStatusBadge status={item.status} />
        </div>
        <form
          id='status-form'
          className='space-y-4'
          onSubmit={() => {
            handleStatusChange(selectedStatus)
          }}
        >
          <div className='space-y-2'>
            <Label htmlFor='status'>New Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger id='status'>
                <SelectValue placeholder='Select new status' />
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
                      <ExpenseStatusBadge status={status.value} />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStatus && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <ExpenseStatusBadge status={item.status} />
              <ArrowRightIcon className='h-4 w-4' />
              <ExpenseStatusBadge status={selectedStatus} />
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='comment'>
              Comment{' '}
              {(selectedStatus === 'REJECTED' ||
                selectedStatus === 'CLARIFICATION') && (
                <span className='text-destructive'>*</span>
              )}
            </Label>
            <Textarea
              id='comment'
              placeholder={
                selectedStatus === 'REJECTED'
                  ? 'Please provide a reason for rejection (required)'
                  : selectedStatus === 'CLARIFICATION'
                    ? 'Please provide a reason for clarification (required)'
                    : 'Add an optional comment about this status change'
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className='min-h-[100px]'
            />
            {selectedStatus === 'REJECTED' && (
              <p className='text-xs text-muted-foreground'>
                A comment is required when rejecting an expense to explain the
                reason.
              </p>
            )}
            {selectedStatus === 'CLARIFICATION' && (
              <p className='text-xs text-muted-foreground'>
                A comment is required when requesting clarification to explain
                the reason.
              </p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type='submit'
          form='status-form'
          onClick={(e) => {
            e.preventDefault()
            if (selectedStatus === 'REJECTED' && comment.length === 0) {
              alert('Please provide a reason for rejection.')
              return
            }
            handleStatusChange(selectedStatus)
          }}
          disabled={
            (selectedStatus === 'REJECTED' && comment.length === 0) ||
            (selectedStatus === 'CLARIFICATION' && comment.length === 0) ||
            !selectedStatus
          }
        >
          {selectedStatus === 'REJECTED' || selectedStatus === 'BOOKED'
            ? 'Close Expense'
            : 'Update Expense'}
        </Button>
      </CardFooter>
    </Card>
  )
}
