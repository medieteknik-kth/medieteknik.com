import type { Category } from '@/models/Form'

export interface InvoiceData {
  hasChapterPaid: boolean
  files: File[]
  description: string
  isOriginalInvoice: boolean
  isInvoiceBooked: boolean
  invoiceDate: Date
  invoiceDueDate: Date
  categories: Category[]
}
