export type ExpenseType = 'invoice' | 'expense'
export type ExpenseStatus =
  | 'BOOKED'
  | 'PAID'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'CLARIFICATION'
  | 'UNCONFIRMED'
  | string

export const EXPENSE_STATUS_LIST = [
  'BOOKED',
  'PAID',
  'CONFIRMED',
  'REJECTED',
  'CLARIFICATION',
  'UNCONFIRMED',
]

export const availableStatuses: {
  label: string
  value: ExpenseStatus
}[] = [
  {
    label: 'Booked',
    value: 'BOOKED',
  },
  {
    label: 'Paid',
    value: 'PAID',
  },
  {
    label: 'Confirmed',
    value: 'CONFIRMED',
  },
  {
    label: 'Rejected',
    value: 'REJECTED',
  },
  {
    label: 'Clarification Requested',
    value: 'CLARIFICATION',
  },
  {
    label: 'Unconfirmed',
    value: 'UNCONFIRMED',
  },
]
