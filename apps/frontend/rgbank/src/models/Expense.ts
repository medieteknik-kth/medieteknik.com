import type { AccountBankInformation } from '@/models/AccountBankInformation'
import type Committee from '@/models/Committee'
import type { Category } from '@/models/Form'
import type { ExpenseStatus } from '@/models/General'
import type Student from '@/models/Student'
import type { Thread } from '@/models/Thread'

export interface ExpenseData {
  files: File[]
  description: string
  date: Date
  isDigital: boolean
  categories: Category[]
}

export interface ExpenseResponse {
  expense_id: string
  file_urls?: string[]
  description: string
  date: string
  isDigital?: boolean
  categories?: Category[]
  status: ExpenseStatus
  created_at: string
  committee?: Committee
  amount?: number
  student?: Student
}

export interface ExpenseResponseDetailed {
  expense: ExpenseResponse
  student: Student
  bank_information: AccountBankInformation
  thread?: Thread
}
