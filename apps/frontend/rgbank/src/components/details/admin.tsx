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
import { type ExpenseStatus, availableStatuses } from '@/models/General'
import type { InvoiceResponse } from '@/models/Invoice'
import type { LanguageCode } from '@/models/Language'
import { useGeneralDetail } from '@/providers/DetailProvider'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface Props {
  language: LanguageCode
  invoice?: InvoiceResponse
  expense?: ExpenseResponse
  updateStatus: (status: ExpenseStatus) => void
}

export default function AdminSection({
  language,
  invoice,
  expense,
  updateStatus,
}: Props) {
  const { addMessage } = useGeneralDetail()
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [comment, setComment] = useState<string>('')

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

  const handleStatusChange = async (status: ExpenseStatus) => {
    const url = invoice
      ? `/api/rgbank/invoices/${invoice.invoice_id}/status`
      : `/api/rgbank/expenses/${expense?.expense_id}/status`
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
      setComment('')
      setSelectedStatus('')
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  return (
    <section className='flex flex-col gap-4 mt-2'>
      <h3 className='text-lg font-medium'>Admin</h3>
      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
          <CardDescription>
            Change the status of this invoice and notify the submitter.
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
                    <SelectItem key={status.value} value={status.value}>
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
                {selectedStatus === 'rejected' && (
                  <span className='text-destructive'>*</span>
                )}
              </Label>
              <Textarea
                id='comment'
                placeholder={
                  selectedStatus === 'rejected'
                    ? 'Please provide a reason for rejection (required)'
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
              !selectedStatus
            }
          >
            Update Status
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}
