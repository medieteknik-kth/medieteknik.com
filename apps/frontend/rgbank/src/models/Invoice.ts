import type { AccountBankInformation } from '@/models/AccountBankInformation'
import type Committee from '@/models/Committee'
import type { Category } from '@/models/Form'
import type { ExpenseStatus } from '@/models/General'
import type Student from '@/models/Student'
import type { Thread } from '@/models/Thread'

export type PaidStatus = 'no_chapter' | 'yes_chapter'

export interface InvoiceData {
  paidStatus?: PaidStatus
  files: File[]
  description: string
  isOriginalInvoice: boolean
  isInvoiceBooked: boolean
  invoiceDate: Date
  invoiceDueDate: Date
  categories: Category[]
}

export interface InvoiceResponse {
  invoice_id: string
  already_paid: boolean
  file_urls: string[]
  description: string
  is_original: boolean
  is_booked: boolean
  date_issued: string
  due_date: string
  categories: Category[]
  status: ExpenseStatus
  created_at: string
  committee?: Committee
  amount?: number
}

export interface InvoiceResponseDetailed {
  invoice: InvoiceResponse
  student: Student
  bank_information: AccountBankInformation
  thread?: Thread
}
