import type { Category } from '@/models/Form'

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
