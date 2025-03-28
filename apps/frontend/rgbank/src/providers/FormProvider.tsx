'use client'

import { FormContext } from '@/components/context/FormContext'
import type { ExpenseData } from '@/models/Expense'
import type { InvoiceData } from '@/models/Invoice'
import { useContext } from 'react'

interface generalFormContextData {
  error: string | null
  setError: (error: string | null) => void
}

export function useGeneralForm(): generalFormContextData {
  const context = useContext(FormContext)

  if (!context) {
    throw new Error('useForm must be used within a FormProvider')
  }

  const { error, setError } = context

  return { error, setError }
}

interface invoiceContextData {
  invoiceData: InvoiceData
  setInvoiceData: (data: InvoiceData) => void
}

export function useInvoice(): invoiceContextData {
  const context = useContext(FormContext)

  if (!context) {
    throw new Error('useInvoice must be used within a FormProvider')
  }

  const { invoiceData, setInvoiceData } = context

  return { invoiceData, setInvoiceData }
}

interface expenseContextData {
  expenseData: ExpenseData
  setExpenseData: (data: ExpenseData) => void
}

export function useExpense(): expenseContextData {
  const context = useContext(FormContext)

  if (!context) {
    throw new Error('useExpense must be used within a FormProvider')
  }

  const { expenseData, setExpenseData } = context

  return { expenseData, setExpenseData }
}

interface fileContextData {
  files: File[]
  setFiles: (files: File[]) => void
  removeFile: (file: File) => void
  addFile: (file: File) => void
}

export function useFiles(): fileContextData {
  const context = useContext(FormContext)

  if (!context) {
    throw new Error('useFiles must be used within a FormProvider')
  }

  const { files, setFiles, removeFile, addFile } = context

  return { files, setFiles, removeFile, addFile }
}
