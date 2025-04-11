'use client'

import {
  type DetailContextType,
  detailReducer,
  initialState,
} from '@/components/context/detailReducer'
import type { AccountBankInformation } from '@/models/AccountBankInformation'
import type { ExpenseResponse } from '@/models/Expense'
import type { ExpenseStatus } from '@/models/General'
import type { InvoiceResponse } from '@/models/Invoice'
import type Student from '@/models/Student'
import type { Message, Thread } from '@/models/Thread'
import { createContext, useCallback, useMemo, useReducer } from 'react'

interface Props {
  children: React.ReactNode
  defaultValues?: Partial<DetailContextType>
}

export const DetailContext = createContext<DetailContextType | undefined>(
  undefined
)

export default function DetailProvider({ children, defaultValues }: Props) {
  const [state, dispatch] = useReducer(
    detailReducer,
    defaultValues ? { ...initialState, ...defaultValues } : initialState
  )

  const setInvoice = useCallback((invoice: InvoiceResponse) => {
    dispatch({ type: 'SET_INVOICE', payload: invoice })
  }, [])

  const setExpense = useCallback((expense: ExpenseResponse) => {
    dispatch({ type: 'SET_EXPENSE', payload: expense })
  }, [])

  const setThread = useCallback((thread: Thread ) => {
    dispatch({ type: 'SET_THREAD', payload: thread })
  }, [])

  const setStudent = useCallback((student: Student) => {
    dispatch({ type: 'SET_STUDENT', payload: student })
  }, [])

  const setBankAccount = useCallback((bankAccount: AccountBankInformation) => {
    dispatch({ type: 'SET_BANK_ACCOUNT', payload: bankAccount })
  }, [])

  const addMessage = useCallback((message: Message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message })
  }, [])

  const updateExpenseStatus = useCallback((status: ExpenseStatus) => {
    dispatch({ type: 'UPDATE_EXPENSE_STATUS', payload: status })
  }, [])

  const updateInvoiceStatus = useCallback((status: ExpenseStatus) => {
    dispatch({ type: 'UPDATE_INVOICE_STATUS', payload: status })
  }, [])

  const contextValue = useMemo(() => {
    return {
      ...state,
      setInvoice,
      setExpense,
      setThread,
      setStudent,
      setBankAccount,
      addMessage,
      updateExpenseStatus,
      updateInvoiceStatus,
    }
  }, [
    state,
    setInvoice,
    setExpense,
    setThread,
    setStudent,
    setBankAccount,
    addMessage,
    updateExpenseStatus,
    updateInvoiceStatus,
  ])

  return (
    <DetailContext.Provider value={contextValue}>
      {children}
    </DetailContext.Provider>
  )
}
