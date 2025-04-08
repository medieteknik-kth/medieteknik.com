export type ExpenseType = 'invoice' | 'expense'
export type ExpenseStatus =
  | 'BOOKED'
  | 'PAID'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'CLARIFICATION'
  | 'UNCONFIRMED'
  | string
