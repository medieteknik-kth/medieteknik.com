'use client'
import { Document } from '@/models/Document'
import { DocumentPagination } from '@/models/Pagination'
import { API_BASE_URL } from '@/utility/Constants'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'

type View = 'grid' | 'list'
type Status = 'active' | 'archived'

interface DocumentState {
  documents: Document[]
  page: number
  total_pages: number
  selectedDocuments: Document[]
  view: View
  status: Status
  isLoading: boolean
  error: string | null
}

type DocumentAction =
  | { type: 'SET_DOCUMENTS'; payload: Document[] }
  | { type: 'ADD_DOCUMENTS'; payload: Document[] }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'NEXT_PAGE' }
  | { type: 'SET_TOTAL_PAGES'; payload: number }
  | { type: 'SELECT_DOCUMENT'; payload: Document }
  | { type: 'SET_SELECTED_DOCUMENTS'; payload: Document[] }
  | { type: 'SET_VIEW'; payload: View }
  | { type: 'SET_STATUS'; payload: Status }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

const initialState: DocumentState = {
  documents: [],
  page: 1,
  total_pages: 1,
  selectedDocuments: [],
  view: 'grid',
  status: 'active',
  isLoading: true,
  error: null,
}

interface DocumentContextType extends DocumentState {
  next: () => void
  selectDocument: (document: Document) => void
  setSelectedDocuments: (documents: Document[]) => void
  setView: (view: View) => void
  setStatus: (status: Status) => void
}

const DocumentManagementContext = createContext<
  DocumentContextType | undefined
>(undefined)

const documentReducer = (
  state: DocumentState,
  action: DocumentAction
): DocumentState => {
  switch (action.type) {
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload, isLoading: false }
    case 'ADD_DOCUMENTS':
      return {
        ...state,
        documents: [...state.documents, ...action.payload],
        isLoading: false,
      }
    case 'SET_PAGE':
      return { ...state, page: action.payload }
    case 'NEXT_PAGE':
      return { ...state, page: state.page + 1 }
    case 'SET_TOTAL_PAGES':
      return { ...state, total_pages: action.payload }
    case 'SELECT_DOCUMENT':
      return {
        ...state,
        selectedDocuments: state.selectedDocuments.includes(action.payload)
          ? state.selectedDocuments.filter(
              (document) => document !== action.payload
            )
          : [...state.selectedDocuments, action.payload],
      }
    case 'SET_SELECTED_DOCUMENTS':
      return { ...state, selectedDocuments: action.payload }
    case 'SET_VIEW':
      return { ...state, view: action.payload }
    case 'SET_STATUS':
      return { ...state, status: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export function DocumentManagementProvider({
  language,
  children,
}: {
  language: string
  children: React.ReactNode
}): JSX.Element {
  const [state, dispatch] = useReducer(documentReducer, initialState)

  useEffect(() => {
    const retrieveDocuments = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      try {
        const response = await fetch(
          `${API_BASE_URL}/public/documents?language=${language}${
            state.status === 'archived' ? '&status=archived' : ''
          }&page=${state.page}`
        )
        if (response.ok) {
          const json = (await response.json()) as DocumentPagination
          dispatch({ type: 'SET_TOTAL_PAGES', payload: json.total_pages })
          if (state.page === 1) {
            dispatch({ type: 'SET_DOCUMENTS', payload: json.items })
          } else {
            dispatch({ type: 'ADD_DOCUMENTS', payload: json.items })
          }
        }
      } catch (error) {
        console.error('Failed to retrieve documents:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to retrieve documents' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    retrieveDocuments()
  }, [language, state.status, state.page])

  const contextValue = useMemo(
    () => ({
      ...state,
      next: () => {
        dispatch({ type: 'NEXT_PAGE' })
      },
      selectDocument: (document: Document) => {
        dispatch({ type: 'SELECT_DOCUMENT', payload: document })
      },
      setSelectedDocuments: (documents: Document[]) => {
        dispatch({ type: 'SET_SELECTED_DOCUMENTS', payload: documents })
      },
      setView: (view: View) => {
        dispatch({ type: 'SET_VIEW', payload: view })
      },
      setStatus: (status: Status) => {
        dispatch({ type: 'SET_PAGE', payload: 1 })
        dispatch({ type: 'SET_STATUS', payload: status })
      },
    }),
    [state]
  )

  return (
    <DocumentManagementContext.Provider value={contextValue}>
      {children}
    </DocumentManagementContext.Provider>
  )
}

export function useDocumentManagement() {
  const context = useContext(DocumentManagementContext)
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider')
  }
  return context
}
