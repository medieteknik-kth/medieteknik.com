'use client'

import { Document } from '@/models/items/Document'
import { DocumentPagination } from '@/models/Pagination'
import { API_BASE_URL } from '@/utility/Constants'
import { useSearchParams } from 'next/navigation'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type JSX,
} from 'react'

type View = 'grid' | 'list'
type Status = 'active' | 'archived'

interface DocumentState {
  /**
   * The list of documents to display.
   */
  documents: Document[]

  /**
   * The current page of documents.
   */
  page: number

  /**
   * The total number of pages of documents.
   */
  total_pages: number

  /**
   * The list of selected documents.
   */
  selectedDocuments: Document[]

  /**
   * The current view of the documents.
   * @type {'grid' | 'list'}
   */
  view: View

  /**
   * The current status of the documents.
   * @type {'active' | 'archived'}
   */
  status: Status

  /**
   * Whether the documents are currently loading.
   */
  isLoading: boolean

  /**
   * The error message if an error occurred.
   */
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
  /**
   * Go to the next page of documents.
   *
   * @returns {void}
   */
  next: () => void

  /**
   * Select a document.
   *
   * @param {Document} document - The document to select.
   * @returns {void}
   */
  selectDocument: (document: Document) => void

  /**
   * Batch select documents.
   *
   * @param {Document[]} documents - The documents to select.
   * @returns {void}
   */
  setSelectedDocuments: (documents: Document[]) => void

  /**
   * Set the view of the documents.
   *
   * @param {View} view - The view to set.
   * @returns {void}
   */
  setView: (view: View) => void

  /**
   * Set the status of the documents.
   *
   * @param {Status} status - The status to set.
   * @returns {void}
   */
  setStatus: (status: Status) => void
}

const DocumentManagementContext = createContext<
  DocumentContextType | undefined
>(undefined)

/**
 * Reducer function for the document management context.
 *
 * @param {DocumentState} state - The current state of the context.
 * @param {DocumentAction} action - The action to perform on the state.
 * @returns {DocumentState} The new state of the context.
 */
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

/**
 * @name DocumentManagementProvider
 * @description A provider for managing documents.
 *
 * @param {string} language - The current language of the application.
 * @param {React.ReactNode} children - The children of the provider.
 * @returns {JSX.Element} The JSX code for the DocumentManagementProvider component.
 */
export function DocumentManagementProvider({
  language,
  children,
}: {
  language: string
  children: React.ReactNode
}): JSX.Element {
  const [state, dispatch] = useReducer(documentReducer, initialState)
  const searchParams = useSearchParams()

  useEffect(() => {
    const retrieveDocuments = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      try {
        const searchQuery = searchParams.get('q') || ''
        const response = await fetch(
          `${API_BASE_URL}/public/documents?language=${language}${
            state.status === 'archived' ? '&status=archived' : ''
          }&page=${state.page}${
            searchQuery ? `&search=${encodeURI(searchQuery.toLowerCase())}` : ''
          }`
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
  }, [language, state.status, state.page, searchParams])

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

/**
 * @name useDocumentManagement
 * @description A hook for using the document management context.
 *
 * @returns {DocumentContextType} The document management context.
 * @throws {Error} Thrown if the hook is used outside of a DocumentProvider.
 */
export function useDocumentManagement() {
  const context = useContext(DocumentManagementContext)
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider')
  }
  return context
}
