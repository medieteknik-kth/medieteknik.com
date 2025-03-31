import type { Category } from '@/models/Form'

export interface ExpenseData {
  files: File[]
  date: Date
  isDigital: boolean
  categories: Category[]
}
