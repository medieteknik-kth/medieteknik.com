'use client'
import { Document } from '@/models/Document'
import { API_BASE_URL } from '@/utility/Constants'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'

type View = 'grid' | 'list'

interface DocumentState {
  documents: Document[]
  selectedDocuments: Document[]
  view: View
  isLoading: boolean
  error: string | null
}

type DocumentAction =
  | { type: 'SET_DOCUMENTS'; payload: Document[] }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'REMOVE_DOCUMENT'; payload: Document }
  | { type: 'SELECT_DOCUMENT'; payload: Document }
  | { type: 'SET_SELECTED_DOCUMENTS'; payload: Document[] }
  | { type: 'SET_VIEW'; payload: View }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

const initialState: DocumentState = {
  documents: [],
  selectedDocuments: [],
  view: 'grid',
  isLoading: true,
  error: null,
}

interface DocumentContextType extends DocumentState {
  addDocument: (document: Document) => void
  removeDocument: (document: Document) => void
  selectDocument: (document: Document) => void
  setSelectedDocuments: (documents: Document[]) => void
  setView: (view: View) => void
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
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] }
    case 'REMOVE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(
          (document) => document !== action.payload
        ),
      }
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
          `${API_BASE_URL}/public/documents?language=${language}`
        )
        if (response.ok) {
          const json = (await response.json()) as Document[]
          dispatch({ type: 'SET_DOCUMENTS', payload: json })
        }
      } catch (error) {
        console.error('Failed to retrieve documents:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to retrieve documents' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    retrieveDocuments()
  }, [])

  const contextValue = useMemo(
    () => ({
      ...state,
      addDocument: (document: Document) => {
        dispatch({ type: 'ADD_DOCUMENT', payload: document })
      },
      removeDocument: (document: Document) => async (document: Document) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        dispatch({ type: 'SET_ERROR', payload: null })
        try {
          const response = await fetch(
            `${API_BASE_URL}/documents/${document.document_id}`,
            {
              method: 'DELETE',
              credentials: 'include',
            }
          )

          if (response.ok) {
            dispatch({ type: 'REMOVE_DOCUMENT', payload: document })
          }
        } catch (error) {
          console.error('Failed to remove document:', error)
          dispatch({ type: 'SET_ERROR', payload: 'Failed to remove document' })
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
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
