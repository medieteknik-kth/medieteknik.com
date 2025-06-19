'use client'

import { useTranslation } from '@/app/i18n/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Comment, { StatusUpdate } from '@/components/ui/comment'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import type { ExpenseResponse } from '@/models/Expense'
import type { InvoiceResponse } from '@/models/Invoice'
import { useStudent } from '@/providers/AuthenticationProvider'
import { useGeneralDetail } from '@/providers/DetailProvider'
import { sortByCreatedAt } from '@/utility/sortUtils'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  language: LanguageCode
  invoice?: InvoiceResponse
  expense?: ExpenseResponse
}

export default function CommentsSection({ language, invoice, expense }: Props) {
  const { thread, addMessage } = useGeneralDetail()
  const { student } = useStudent()
  const [currentMessage, setCurrentMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { t } = useTranslation(language, 'processing')
  const { t: expenseT } = useTranslation(language, 'expense')
  const { t: invoiceT } = useTranslation(language, 'invoice')

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

  if (!student) {
    return null
  }

  const allMessages = thread?.messages?.concat(thread?.unread_messages ?? [])

  const handleSubmit = async (message: string) => {
    const url = invoice
      ? `/api/rgbank/invoices/${invoice.invoice_id}/messages`
      : `/api/rgbank/expenses/${expense?.expense_id}/messages`
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        toast.error('Error', {
          description: errorData.error || 'An error occurred',
        })
        throw new Error(errorData.error || 'An error occurred')
      }

      addMessage({
        message_id: crypto.randomUUID(),
        content: message,
        created_at: new Date().toISOString(),
        message_type: 'STUDENT',
        sender: student,
      })
    } catch (error) {
      setErrorMessage(
        (error as Error).message ||
          'An error occurred while sending the message'
      )
    }
  }

  return (
    <div className='space-y-6 mt-2'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>{t('comments.title')}</h3>
        {thread && (
          <Badge variant='outline' className='text-xs'>
            {t('comments.total', {
              count: allMessages?.filter(
                (message) => message.message_type !== 'SYSTEM'
              ).length,
            })}
          </Badge>
        )}
      </div>

      <form
        className='space-y-3'
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(currentMessage)
        }}
      >
        {errorMessage && (
          <div className='text-red-500 text-sm'>{errorMessage}</div>
        )}
        <Label htmlFor='comment'>{t('comments.add.label')}</Label>
        <Textarea
          id='comment'
          placeholder={t('comments.add.placeholder', {
            type: invoice
              ? invoiceT('invoice').toLowerCase()
              : expenseT('expense').toLowerCase(),
          })}
          className='min-h-[100px]'
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        {item.status !== 'UNCONFIRMED' && item.status !== 'CLARIFICATION' && (
          <div className='text-xs text-muted-foreground'>
            {t('comments.add.disabled')}
          </div>
        )}
        <div className='flex justify-end gap-2'>
          <Button
            type='submit'
            disabled={
              item.status !== 'UNCONFIRMED' && item.status !== 'CLARIFICATION'
            }
          >
            {t('comments.add.button')}
          </Button>
        </div>
      </form>

      <Separator />
      <div className='space-y-4'>
        {allMessages && allMessages.length > 0 ? (
          sortByCreatedAt(allMessages).map((message) => {
            if (!message.sender) {
              if (!message.previous_status || !message.new_status) {
                return null
              }

              return (
                <StatusUpdate
                  language={language}
                  key={message.message_id}
                  date={message.created_at}
                  previousStatus={message.previous_status}
                  newStatus={message.new_status}
                  message={message.content}
                />
              )
            }

            return (
              <Comment
                key={message.message_id}
                date={message.created_at}
                notSameUser={message.sender.student_id !== student.student_id}
                student={message.sender}
                message={{
                  message: message.content,
                  type: 'comment',
                }}
              />
            )
          })
        ) : (
          <div className='flex items-center justify-center w-full h-32 text-sm text-muted-foreground'>
            {t('comments.empty')}
          </div>
        )}
      </div>
    </div>
  )
}
