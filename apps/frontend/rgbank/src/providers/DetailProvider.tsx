'use client'

import { DetailContext } from '@/components/context/DetailContext'
import type { AccountBankInformation } from '@/models/AccountBankInformation'
import type { ExpenseResponse } from '@/models/Expense'
import type { ExpenseStatus } from '@/models/General'
import type { InvoiceResponse } from '@/models/Invoice'
import type Student from '@/models/Student'
import type { Message, Thread } from '@/models/Thread'
import { useContext } from 'react'

interface generalDetailContextData {
  student: Student
  thread: Thread | undefined
  bankAccount: AccountBankInformation
  previousStatus: ExpenseStatus | undefined
  setStudent: (student: Student) => void
  setThread: (thread: Thread) => void
  setBankAccount: (bankAccount: AccountBankInformation) => void
  addMessage: (message: Message) => void
}

export function useGeneralDetail(): generalDetailContextData {
  const context = useContext(DetailContext)

  if (!context) {
    throw new Error('useGeneralDetail must be used within a DetailProvider')
  }

  const {
    student,
    thread,
    bankAccount,
    previousStatus,
    setStudent,
    setThread,
    setBankAccount,
    addMessage,
  } = context

  return {
    student,
    thread,
    bankAccount,
    previousStatus,
    setStudent,
    setThread,
    setBankAccount,
    addMessage,
  }
}

interface invoiceContextData {
  invoice: InvoiceResponse
  setInvoice: (data: InvoiceResponse) => void
  updateStatus: (status: ExpenseStatus) => void
}

export function useInvoiceDetail(): invoiceContextData {
  const context = useContext(DetailContext)

  if (!context) {
    throw new Error('useInvoice must be used within a DetailProvider')
  }

  const { invoice, setInvoice, updateInvoiceStatus: updateStatus } = context

  return { invoice, setInvoice, updateStatus }
}

interface expenseContextData {
  expense: ExpenseResponse
  setExpense: (data: ExpenseResponse) => void
  updateStatus: (status: ExpenseStatus) => void
}

export function useExpenseDetail(): expenseContextData {
  const context = useContext(DetailContext)

  if (!context) {
    throw new Error('useExpense must be used within a DetailProvider')
  }

  const { expense, setExpense, updateExpenseStatus: updateStatus } = context

  return { expense, setExpense, updateStatus }
}
