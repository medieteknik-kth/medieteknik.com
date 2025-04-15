import { cn } from '@/lib/utils'
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

interface ExpenseBadgeProps {
  type: ExpenseType
  className?: string
}

interface ExpenseStatusBadgeProps {
  status: ExpenseStatus
  className?: string
}

export function ExpenseBadge({ type, className }: ExpenseBadgeProps) {
  switch (type) {
    case 'invoice':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-purple-500 bg-purple-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
        >
          <DocumentTextIcon className='h-4 w-4' />
          Invoice
        </div>
      )
    case 'expense':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-red-500 bg-red-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
        >
          <CreditCardIcon className='h-4 w-4' />
          Expense
        </div>
      )
    default:
      return (
        <div className='flex items-center gap-2 text-gray-500'>Unknown</div>
      )
  }
}

export function ExpenseStatusBadge({
  status,
  className,
}: ExpenseStatusBadgeProps) {
  switch (status) {
    case 'BOOKED':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-emerald-500 bg-emerald-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
        >
          <ClipboardDocumentCheckIcon className='h-4 w-4' />
          Booked
        </div>
      )

    case 'REJECTED':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-red-500 bg-red-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
        >
          <XMarkIcon className='h-4 w-4' />
          Rejected
        </div>
      )

    case 'PAID':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-blue-500 bg-blue-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
        >
          <CreditCardIcon className='h-4 w-4' />
          Paid
        </div>
      )

    case 'CONFIRMED':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-sky-500 bg-sky-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
        >
          <CheckIcon className='h-4 w-4' />
          Confirmed
        </div>
      )

    case 'CLARIFICATION':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-orange-500 bg-orange-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
        >
          <ExclamationTriangleIcon className='h-4 w-4' />
          Clarification
        </div>
      )
    case 'UNCONFIRMED':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-yellow-500 bg-yellow-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
        >
          <ClockIcon className='h-4 w-4' />
          Unconfirmed
        </div>
      )

    default:
      return (
        <div className='flex items-center gap-2 text-gray-500'>Unknown</div>
      )
  }
}
