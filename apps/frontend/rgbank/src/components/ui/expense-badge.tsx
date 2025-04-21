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
  short?: boolean
  className?: string
}

interface ExpenseStatusBadgeProps {
  status: ExpenseStatus
  short?: boolean
  className?: string
}

export function ExpenseBadge({ type, short, className }: ExpenseBadgeProps) {
  switch (type) {
    case 'invoice':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-purple-500 bg-purple-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
          title='Invoice'
        >
          <DocumentTextIcon className='h-4 w-4' />
          {!short && <span>Invoice</span>}
        </div>
      )
    case 'expense':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-red-500 bg-red-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
          title='Expense'
        >
          <CreditCardIcon className='h-4 w-4' />
          {!short && <span>Expense</span>}
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
  short,
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
          title='Booked'
        >
          <ClipboardDocumentCheckIcon className='h-4 w-4' />
          {!short && <span>Booked</span>}
        </div>
      )

    case 'REJECTED':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-red-500 bg-red-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
          title='Rejected'
        >
          <XMarkIcon className='h-4 w-4' />
          {!short && <span>Rejected</span>}
        </div>
      )

    case 'PAID':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-blue-500 bg-blue-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
          title='Paid'
        >
          <CreditCardIcon className='h-4 w-4' />
          {!short && <span>Paid</span>}
        </div>
      )

    case 'CONFIRMED':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-sky-500 bg-sky-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
          title='Confirmed'
        >
          <CheckIcon className='h-4 w-4' />
          {!short && <span>Confirmed</span>}
        </div>
      )

    case 'CLARIFICATION':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-orange-500 bg-orange-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
          title='Clarification'
        >
          <ExclamationTriangleIcon className='h-4 w-4' />
          {!short && <span>Clarification</span>}
        </div>
      )
    case 'UNCONFIRMED':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-yellow-500 bg-yellow-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
          title='Unconfirmed'
        >
          <ClockIcon className='h-4 w-4' />
          {!short && <span>Unconfirmed</span>}
        </div>
      )

    default:
      return (
        <div className='flex items-center gap-2 text-gray-500'>Unknown</div>
      )
  }
}
