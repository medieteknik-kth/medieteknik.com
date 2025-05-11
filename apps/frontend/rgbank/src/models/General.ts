export type ExpenseType = 'invoice' | 'expense'
export type ExpenseStatus =
  | 'BOOKED'
  | 'REJECTED'
  | 'PAID'
  | 'CONFIRMED'
  | 'CLARIFICATION'
  | 'UNCONFIRMED'
  | string

export const EXPENSE_STATUS_LIST = [
  'BOOKED',
  'REJECTED',
  'PAID',
  'CONFIRMED',
  'CLARIFICATION',
  'UNCONFIRMED',
]

export const EXPENSE_STATUS_VALUES = {
  /* [0-9] Unconfirmed statuses */
  UNCONFIRMED: 0, // Just created / Awaiting approval

  /* [10-19] Additional information needed statuses */
  CLARIFICATION: 10, // Awaiting clarification

  /* [20-29] Confirmed statuses */
  CONFIRMED: 20, // Valid expense / Awaiting payment

  /* [30-39] Payment statuses */
  PAID: 30, // Payment received

  /* [40-49] Finished statuses */
  REJECTED: 40, // Invalid expense
  BOOKED: 41, // Invoice booked in the system
} as const

export type ExpenseStatusValues =
  (typeof EXPENSE_STATUS_VALUES)[keyof typeof EXPENSE_STATUS_VALUES]

export const availableStatuses: {
  label: string
  value: ExpenseStatus
}[] = [
  {
    label: 'Booked',
    value: 'BOOKED',
  },
  {
    label: 'Rejected',
    value: 'REJECTED',
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
    label: 'Clarification Requested',
    value: 'CLARIFICATION',
  },
  {
    label: 'Unconfirmed',
    value: 'UNCONFIRMED',
  },
]
