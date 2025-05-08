import type { AccountBankInformation } from '@/models/AccountBankInformation'
import type { ExpenseResponse } from '@/models/Expense'
import type { ExpenseStatus } from '@/models/General'
import type { InvoiceResponse } from '@/models/Invoice'
import type { Message, Thread } from '@/models/Thread'
import type { Student } from '@medieteknik/models'

interface DetailState {
  invoice: InvoiceResponse
  expense: ExpenseResponse
  thread: Thread
  student: Student
  bankAccount: AccountBankInformation
  previousStatus?: ExpenseStatus
}

export interface DetailContextType extends DetailState {
  setInvoice: (invoice: InvoiceResponse) => void
  setExpense: (expense: ExpenseResponse) => void
  setThread: (thread: Thread) => void
  setStudent: (student: Student) => void
  setBankAccount: (bankAccount: AccountBankInformation) => void
  addMessage: (message: Message) => void
  updateExpenseStatus: (status: ExpenseStatus) => void
  updateInvoiceStatus: (status: ExpenseStatus) => void
}

type DetailAction =
  | { type: 'SET_INVOICE'; payload: InvoiceResponse }
  | { type: 'SET_EXPENSE'; payload: ExpenseResponse }
  | { type: 'SET_THREAD'; payload: Thread }
  | { type: 'SET_STUDENT'; payload: Student }
  | { type: 'SET_BANK_ACCOUNT'; payload: AccountBankInformation }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_EXPENSE_STATUS'; payload: ExpenseStatus }
  | { type: 'UPDATE_INVOICE_STATUS'; payload: ExpenseStatus }

export const initialState: DetailState = {
  invoice: {
    invoice_id: '',
    already_paid: false,
    categories: [],
    created_at: '',
    date_issued: '',
    title: '',
    description: '',
    due_date: '',
    file_urls: [],
    is_booked: false,
    is_original: false,
    status: 'UNCONFIRMED',
    amount: 0,
    committee: undefined,
  },
  expense: {
    expense_id: '',
    categories: [],
    created_at: '',
    title: '',
    description: '',
    file_urls: [],
    date: '',
    isDigital: false,
    status: 'UNCONFIRMED',
    amount: 0,
    committee: undefined,
  },
  thread: {
    thread_id: crypto.randomUUID(),
    messages: [],
    unread_messages: [],
  },
  student: {
    student_id: '',
    author_type: 'STUDENT',
    first_name: '',
    student_type: 'OTHER',
  },
  bankAccount: {
    account_number: '',
    bank_name: '',
    clearing_number: '',
  },
}

export function detailReducer(state: DetailState, action: DetailAction) {
  switch (action.type) {
    case 'SET_INVOICE':
      return { ...state, invoice: action.payload }
    case 'SET_EXPENSE':
      return { ...state, expense: action.payload }
    case 'SET_THREAD':
      return { ...state, thread: action.payload }
    case 'SET_STUDENT':
      return { ...state, student: action.payload }
    case 'SET_BANK_ACCOUNT':
      return { ...state, bankAccount: action.payload }
    case 'ADD_MESSAGE': {
      if (state.thread) {
        if (!state.thread.messages) {
          state.thread.messages = []
        }

        const newThread = {
          ...state.thread,
          messages: [...state.thread.messages, action.payload],
        }
        return { ...state, thread: newThread }
      }
      return state
    }
    case 'UPDATE_EXPENSE_STATUS': {
      state.previousStatus = state.expense.status
      const newExpense = {
        ...state.expense,
        status: action.payload,
      }
      return { ...state, expense: newExpense }
    }

    case 'UPDATE_INVOICE_STATUS': {
      state.previousStatus = state.invoice.status
      const newInvoice = {
        ...state.invoice,
        status: action.payload,
      }
      return { ...state, invoice: newInvoice }
    }

    default:
      return state
  }
}
