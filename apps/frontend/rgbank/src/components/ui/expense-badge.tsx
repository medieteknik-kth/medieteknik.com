'use client'

import { useTranslation } from '@/app/i18n/client'
import type { ExpenseStatus, ExpenseType } from '@/models/General'
import {
  CheckIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { cn } from '@medieteknik/ui'

interface ExpenseBadgeProps {
  /**
   * The language code for translation.
   */
  language: LanguageCode

  /**
   * The type of the expense.
   */
  type: ExpenseType

  /**
   * Whether to show a short version of the badge.
   */
  short?: boolean

  /**
   * Additional class names for styling.
   */
  className?: string
}

interface ExpenseStatusBadgeProps {
  /**
   * The language code for translation.
   */
  language: LanguageCode

  /**
   * The status of the expense.
   */
  status: ExpenseStatus

  /**
   * Whether to show a short version of the badge.
   */
  short?: boolean

  /**
   * Additional class names for styling.
   */
  className?: string
}

export function ExpenseBadge({
  language,
  type,
  short,
  className,
}: ExpenseBadgeProps) {
  const { t: invoiceT } = useTranslation(language, 'invoice')
  const { t: expenseT } = useTranslation(language, 'expense')
  switch (type) {
    case 'invoice':
      return (
        <div
          className={cn(
            'badge invoice',
            'w-fit flex items-center gap-2 text-purple-500 bg-purple-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
          title='Invoice'
        >
          <DocumentTextIcon className='h-4 w-4' />
          {!short && <span>{invoiceT('invoice')}</span>}
        </div>
      )
    case 'expense':
      return (
        <div
          className={cn(
            'badge expense',
            'w-fit flex items-center gap-2 text-red-500 bg-red-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
          title='Expense'
        >
          <CreditCardIcon className='h-4 w-4' />
          {!short && <span>{expenseT('expense')}</span>}
        </div>
      )
    default:
      return (
        <div className='flex items-center gap-2 text-gray-500'>Unknown</div>
      )
  }
}

export function ExpenseStatusBadge({
  language,
  status,
  short,
  className,
}: ExpenseStatusBadgeProps) {
  const { t } = useTranslation(language, 'status')
  switch (status) {
    case 'BOOKED':
      return (
        <div
          className={cn(
            'badge booked',
            'w-fit flex items-center gap-2 text-emerald-500 bg-emerald-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
          title='Booked'
        >
          <ClipboardDocumentCheckIcon className='h-4 w-4' />
          {!short && <span>{t('booked')}</span>}
        </div>
      )

    case 'REJECTED':
      return (
        <div
          className={cn(
            'badge rejected',
            'w-fit flex items-center gap-2 text-red-500 bg-red-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
          title='Rejected'
        >
          <XMarkIcon className='h-4 w-4' />
          {!short && <span>{t('rejected')}</span>}
        </div>
      )

    case 'PAID':
      return (
        <div
          className={cn(
            'badge paid',
            'w-fit flex items-center gap-2 text-blue-500 bg-blue-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
          title='Paid'
        >
          <CreditCardIcon className='h-4 w-4' />
          {!short && <span>{t('paid')}</span>}
        </div>
      )

    case 'CONFIRMED':
      return (
        <div
          className={cn(
            'badge confirmed',
            'w-fit flex items-center gap-2 text-sky-500 bg-sky-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
          title='Confirmed'
        >
          <CheckIcon className='h-4 w-4' />
          {!short && <span>{t('confirmed')}</span>}
        </div>
      )

    case 'CLARIFICATION':
      return (
        <div
          className={cn(
            'badge clarification',
            'w-fit flex items-center gap-2 text-orange-500 bg-orange-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
          title='Clarification'
        >
          <ExclamationTriangleIcon className='h-4 w-4' />
          {!short && <span>{t('clarification')}</span>}
        </div>
      )
    case 'UNCONFIRMED':
      return (
        <div
          className={cn(
            'badge unconfirmed',
            'w-fit flex items-center gap-2 text-yellow-500 bg-yellow-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
          title='Unconfirmed'
        >
          <ClockIcon className='h-4 w-4' />
          {!short && <span>{t('unconfirmed')}</span>}
        </div>
      )

    default:
      return (
        <div className='flex items-center gap-2 text-gray-500'>
          {t('unknown')}
        </div>
      )
  }
}
