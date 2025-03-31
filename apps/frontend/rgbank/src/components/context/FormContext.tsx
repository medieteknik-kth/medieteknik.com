'use client'

import {
  type FormContextType,
  formReducer,
  initialState,
} from '@/components/context/formReducer'
import type { ExpenseData } from '@/models/Expense'
import type { InvoiceData } from '@/models/Invoice'
import { createContext, useCallback, useMemo, useReducer } from 'react'

interface Props {
  children: React.ReactNode
}

export const FormContext = createContext<FormContextType | undefined>(undefined)

export default function FormProvider({ children }: Props) {
  const [state, dispatch] = useReducer(formReducer, initialState)

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }, [])

  const setFiles = useCallback((files: File[]) => {
    dispatch({ type: 'SET_FILES', payload: files })
  }, [])

  const removeFile = useCallback((file: File) => {
    dispatch({ type: 'REMOVE_FILE', payload: file })
  }, [])

  const addFile = useCallback((file: File) => {
    dispatch({ type: 'ADD_FILE', payload: file })
  }, [])

  const removeAllFiles = useCallback(() => {
    dispatch({ type: 'REMOVE_ALL_FILES' })
  }, [])

  const setInvoiceData = useCallback((data: InvoiceData) => {
    dispatch({ type: 'SET_INVOICE_DATA', payload: data })
  }, [])

  const setExpenseData = useCallback((data: ExpenseData) => {
    dispatch({ type: 'SET_EXPENSE_DATA', payload: data })
  }, [])

  const contextValue = useMemo(() => {
    return {
      ...state,

      setFiles,
      removeFile,
      addFile,
      removeAllFiles,
      setError,
      setInvoiceData,
      setExpenseData,
    }
  }, [
    state,
    setError,
    setFiles,
    removeFile,
    removeAllFiles,
    addFile,
    setExpenseData,
    setInvoiceData,
  ])

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  )
}
