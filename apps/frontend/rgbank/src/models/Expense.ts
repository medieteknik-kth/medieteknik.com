import type { Category } from '@/models/Form'

export interface ExpenseData {
  files: File[]
  description: string
  date: Date
  isDigital: boolean
  categories: Category[]
}
