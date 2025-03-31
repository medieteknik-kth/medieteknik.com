import type { ExpenseData } from '@/models/Expense'
import type { InvoiceData } from '@/models/Invoice'

interface FormState {
  error: string | null
  files: File[]
  invoiceData: InvoiceData
  expenseData: ExpenseData
}

export interface FormContextType extends FormState {
  setError: (error: string | null) => void
  setFiles: (files: File[]) => void
  removeFile: (file: File) => void
  addFile: (file: File) => void
  removeAllFiles: () => void
  setInvoiceData: (data: InvoiceData) => void
  setExpenseData: (data: ExpenseData) => void
}

type FormAction =
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILES'; payload: File[] }
  | { type: 'ADD_FILE'; payload: File }
  | { type: 'REMOVE_FILE'; payload: File }
  | { type: 'REMOVE_ALL_FILES' }
  | { type: 'SET_INVOICE_DATA'; payload: InvoiceData }
  | { type: 'SET_EXPENSE_DATA'; payload: ExpenseData }

export const initialState: FormState = {
  error: null,
  files: [],
  invoiceData: {
    files: [],
    description: '',
    isOriginalInvoice: false,
    isInvoiceBooked: false,
    invoiceDate: new Date(),
    invoiceDueDate: new Date(),
    categories: [],
  },
  expenseData: {
    files: [],
    date: new Date(),
    isDigital: false,
    categories: [],
  },
}

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_FILES':
      return { ...state, files: action.payload }
    case 'ADD_FILE':
      return { ...state, files: [...state.files, action.payload] }
    case 'REMOVE_FILE':
      return {
        ...state,
        files: state.files.filter((file) => file.name !== action.payload.name),
      }
    case 'REMOVE_ALL_FILES':
      return { ...state, files: [] }
    case 'SET_INVOICE_DATA':
      return { ...state, invoiceData: action.payload }
    case 'SET_EXPENSE_DATA':
      return { ...state, expenseData: action.payload }
    default:
      return state
  }
}
