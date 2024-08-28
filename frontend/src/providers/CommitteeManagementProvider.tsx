'use client'
import Committee, {
  CommitteePosition,
  CommitteePositionRecruitment,
} from '@/models/Committee'
import { StudentMembershipPagination } from '@/models/Pagination'
import Student, { StudentMembership } from '@/models/Student'
import { API_BASE_URL } from '@/utility/Constants'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'

interface CommitteeManagementState {
  committee: Committee | null
  members: StudentMembershipPagination
  positions: CommitteePosition[]
  recruitments: CommitteePositionRecruitment[]
  total_news: number
  total_events: number
  total_documents: number
  error: string | null
  isLoading: boolean
}

type CommitteeManagementAction =
  | { type: 'SET_COMMITTEE'; payload: Committee }
  | { type: 'SET_MEMBERS'; payload: StudentMembershipPagination }
  | { type: 'ADD_MEMBER'; payload: StudentMembership }
  | { type: 'SET_POSITIONS'; payload: CommitteePosition[] }
  | { type: 'ADD_POSITION'; payload: CommitteePosition }
  | { type: 'SET_RECRUITMENTS'; payload: CommitteePositionRecruitment[] }
  | { type: 'ADD_RECRUITMENT'; payload: CommitteePositionRecruitment }
  | { type: 'SET_NEWS_TOTAL'; payload: number }
  | { type: 'SET_EVENTS_TOTAL'; payload: number }
  | { type: 'SET_DOCUMENTS_TOTAL'; payload: number }
  | { type: 'INCREMENT_NEWS' }
  | { type: 'INCREMENT_EVENTS' }
  | { type: 'INCREMENT_DOCUMENTS' }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }

const initialState: CommitteeManagementState = {
  committee: null,
  members: {
    page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 0,
    items: [],
  },
  positions: [],
  recruitments: [],
  total_news: 0,
  total_events: 0,
  total_documents: 0,
  error: null,
  isLoading: true,
}

interface CommitteeManagementContextType extends CommitteeManagementState {
  setCommittee: (committee: Committee) => void
  setMembers: (members: StudentMembershipPagination) => void
  addMember: (member: StudentMembership) => void
  setPositions: (positions: CommitteePosition[]) => void
  addPosition: (position: CommitteePosition) => void
  incrementNews: () => void
  incrementEvents: () => void
  incrementDocuments: () => void
}

const CommitteeManagementContext = createContext<
  CommitteeManagementContextType | undefined
>(undefined)

const committeeManagementReducer = (
  state: CommitteeManagementState,
  action: CommitteeManagementAction
): CommitteeManagementState => {
  switch (action.type) {
    case 'SET_COMMITTEE':
      return {
        ...state,
        committee: action.payload,
      }
    case 'SET_MEMBERS':
      return {
        ...state,
        members: action.payload,
      }
    case 'ADD_MEMBER':
      return {
        ...state,
        members: {
          ...state.members,
          items: [...state.members.items, action.payload],
        },
      }
    case 'SET_POSITIONS':
      return {
        ...state,
        positions: action.payload,
      }
    case 'ADD_POSITION':
      return {
        ...state,
        positions: [...state.positions, action.payload],
      }
    case 'SET_RECRUITMENTS':
      return {
        ...state,
        recruitments: action.payload,
      }
    case 'ADD_RECRUITMENT':
      return {
        ...state,
        recruitments: [...state.recruitments, action.payload],
      }
    case 'SET_NEWS_TOTAL':
      return {
        ...state,
        total_news: action.payload,
      }
    case 'SET_EVENTS_TOTAL':
      return {
        ...state,
        total_events: action.payload,
      }
    case 'SET_DOCUMENTS_TOTAL':
      return {
        ...state,
        total_documents: action.payload,
      }
    case 'INCREMENT_NEWS':
      return {
        ...state,
        total_news: state.total_news + 1,
      }
    case 'INCREMENT_EVENTS':
      return {
        ...state,
        total_events: state.total_events + 1,
      }
    case 'INCREMENT_DOCUMENTS':
      return {
        ...state,
        total_documents: state.total_documents + 1,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}

interface CommitteeDataResponse {
  members: StudentMembershipPagination
  positions: CommitteePosition[]
  total_news: number
  total_events: number
  total_documents: number
}

export function CommitteeManagementProvider({
  committee,
  language,
  children,
}: {
  committee: Committee
  language: string
  children: React.ReactNode
}) {
  const [state, dispatch] = useReducer(committeeManagementReducer, initialState)

  useEffect(() => {
    const retrieveData = async (committee: Committee) => {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      dispatch({ type: 'SET_COMMITTEE', payload: committee })
      try {
        const [dataResponse, recruitmentResponse] = await Promise.all([
          fetch(
            `${API_BASE_URL}/committees/${committee.translations[0].title.toLowerCase()}/data?language=${language}`,
            {
              method: 'GET',
              credentials: 'include',
            }
          ),
          fetch(
            `${API_BASE_URL}/public/committee_positions/recruiting?committee=${committee.translations[0].title.toLowerCase()}&language=${language}`,
            {
              method: 'GET',
            }
          ),
        ])

        if (dataResponse.ok && recruitmentResponse.ok) {
          const jsonData = (await dataResponse.json()) as CommitteeDataResponse
          const jsonRecruitment =
            (await recruitmentResponse.json()) as CommitteePositionRecruitment[]

          dispatch({ type: 'SET_MEMBERS', payload: jsonData.members })
          dispatch({ type: 'SET_POSITIONS', payload: jsonData.positions })
          dispatch({ type: 'SET_NEWS_TOTAL', payload: jsonData.total_news })
          dispatch({ type: 'SET_EVENTS_TOTAL', payload: jsonData.total_events })
          dispatch({
            type: 'SET_DOCUMENTS_TOTAL',
            payload: jsonData.total_documents,
          })
          dispatch({ type: 'SET_RECRUITMENTS', payload: jsonRecruitment })
        }
      } catch (error) {
        console.error('Failed to retrieve data:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to retrieve data' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    retrieveData(committee)
  }, [committee])

  const contextValue = useMemo(
    () => ({
      ...state,
      setCommittee: (committee: Committee) =>
        dispatch({ type: 'SET_COMMITTEE', payload: committee }),
      setMembers: (members: StudentMembershipPagination) =>
        dispatch({ type: 'SET_MEMBERS', payload: members }),
      addMember: (member: StudentMembership) =>
        dispatch({ type: 'ADD_MEMBER', payload: member }),
      setPositions: (positions: CommitteePosition[]) =>
        dispatch({ type: 'SET_POSITIONS', payload: positions }),
      addPosition: (position: CommitteePosition) =>
        dispatch({ type: 'ADD_POSITION', payload: position }),
      setNewsTotal: (total: number) =>
        dispatch({ type: 'SET_NEWS_TOTAL', payload: total }),
      setEventsTotal: (total: number) =>
        dispatch({ type: 'SET_EVENTS_TOTAL', payload: total }),
      setDocumentsTotal: (total: number) =>
        dispatch({ type: 'SET_DOCUMENTS_TOTAL', payload: total }),
      incrementNews: () => dispatch({ type: 'INCREMENT_NEWS' }),
      incrementEvents: () => dispatch({ type: 'INCREMENT_EVENTS' }),
      incrementDocuments: () => dispatch({ type: 'INCREMENT_DOCUMENTS' }),
    }),
    [state]
  )

  return (
    <CommitteeManagementContext.Provider value={contextValue}>
      {children}
    </CommitteeManagementContext.Provider>
  )
}

export function useCommitteeManagement() {
  const context = useContext(CommitteeManagementContext)
  if (context === undefined) {
    throw new Error(
      'useCommitteeManagement must be used within a CommitteeManagementProvider'
    )
  }
  return context
}
