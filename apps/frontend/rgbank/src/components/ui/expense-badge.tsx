import { cn } from '@/lib/utils'
import type { ExpenseStatus, ExpenseType } from '@/models/General'
import { CreditCardIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

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
    case 'pending':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-yellow-500 bg-yellow-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
        >
          Pending
        </div>
      )
    case 'approved':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-green-500 bg-green-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
        >
          Approved
        </div>
      )
    case 'rejected':
      return (
        <div
          className={cn(
            'w-fit flex items-center gap-2 text-red-500 bg-red-500/20 px-2 py-1 rounded-2xl text-xs font-semibold',
            className
          )}
        >
          Rejected
        </div>
      )
    default:
      return (
        <div className='flex items-center gap-2 text-gray-500'>Unknown</div>
      )
  }
}
