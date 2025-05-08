import type { ExpenseResponse } from '@/models/Expense'
import type { ExpenseStatus } from '@/models/General'
import type { InvoiceResponse } from '@/models/Invoice'
import type { Student } from '@medieteknik/models'

export function filterItems<
  T extends {
    title: string
    description: string
    student?: Student
    status: ExpenseStatus
  },
>(items: T[], search: string, activeStatus: ExpenseStatus[]): T[] {
  if (!search && activeStatus.length === 0) {
    return items
  }

  const combinedString = (item: T) => {
    return `${item.title} ${item.description} ${item.student?.first_name}`
  }

  return items.filter(
    (item) =>
      (!search ||
        combinedString(item).toLowerCase().includes(search.toLowerCase())) &&
      (activeStatus.length === 0 || activeStatus.includes(item.status))
  )
}

export function filterExpense(
  expenses: ExpenseResponse[],
  search: string,
  activeStatus: ExpenseStatus[]
) {
  return filterItems(expenses, search, activeStatus)
}

export function filterInvoice(
  invoices: InvoiceResponse[],
  search: string,
  activeStatus: ExpenseStatus[]
) {
  return filterItems(invoices, search, activeStatus)
}
