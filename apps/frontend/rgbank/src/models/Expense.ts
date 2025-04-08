import type Committee from '@/models/Committee'
import type { Category } from '@/models/Form'
import type { ExpenseStatus } from '@/models/General'

export interface ExpenseData {
  files: File[]
  description: string
  date: Date
  isDigital: boolean
  categories: Category[]
}

export interface ExpenseResponse {
  expense_id: string
  file_urls: string[]
  description: string
  date: string
  isDigital: boolean
  categories: Category[]
  status: ExpenseStatus
  created_at: string
  committee?: Committee
  amount?: number
}
