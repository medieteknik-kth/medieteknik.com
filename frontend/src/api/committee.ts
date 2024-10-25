import Committee, {
  CommitteeCategory,
  CommitteePosition,
  CommitteePositionRecruitment,
} from '@/models/Committee'
import { StudentMembership } from '@/models/Student'
import { cache } from 'react'
import api from './index'

export const GetCommitteePublic = cache(
  async (committee: string, language_code?: string) => {
    try {
      const response = await api.get(
        `/public/committees/${committee}${
          language_code ? `?language=${language_code}` : ``
        }`
      )

      if (response.status === 200) {
        const data = response.data
        data.author_type = 'COMMITTEE'
        return data as Committee
      }

      return null
    } catch (error: any) {
      return null
    }
  }
)

export const GetAllCommittees = cache(async (language_code?: string) => {
  const response = await api.get(
    `/public/committees${language_code ? `?language=${language_code}` : ``}`
  )

  if (response.status === 200) {
    return response.data as Committee[]
  }

  return null
})

export const GetCommittee = cache(
  async (committee: string, language_code: string) => {
    const response = await api.get(
      `/committees/${committee}?language=${language_code}`
    )

    if (response.status === 200) {
      return response.data as Committee
    }

    return null
  }
)

export const GetCommitteeData = cache(async (committee: string) => {
  const response = await api.get(`/committees/${committee}/data`, {
    withCredentials: true,
  })

  if (response.status === 200) {
    return response.data as {
      members: {
        ids: string[]
        total: number
      }
      positions: {
        ids: string[]
        total: number
      }
      news: {
        ids: string[]
        total: number
      }
      events: {
        ids: string[]
        total: number
      }
      documents: {
        ids: string[]
        total: number
      }
      albums: {
        ids: string[]
        total: number
      }
    }
  }

  return null
})

export const GetCommitteeCategories = cache(async (language_code: string) => {
  try {
    const response = await api.get(
      `/public/committee_categories?language=${language_code}`
    )

    if (response.status === 200) {
      return response.data as CommitteeCategory[]
    }

    return null
  } catch (error) {
    console.error(error)
    return null
  }
})

export const GetCommitteeCategoryCommittees = cache(
  async (category: string, language_code: string) => {
    const response = await api.get(
      `/public/committee_categories/${category}?language=${language_code}&committees=True`
    )

    if (response.status === 200) {
      return response.data as CommitteeCategory & { committees: Committee[] }
    }

    return null
  }
)

export const GetCommitteeMembers = cache(
  async (
    committee: string,
    language_code: string,
    page: number,
    per_page: number = 25
  ) => {
    const response = await api.get(
      `public/committees/${committee}/members?language=${language_code}&page=${page}&per_page=${per_page}`
    )

    if (response.status === 200) {
      return response.data as {
        items: StudentMembership[]
        page: number
        per_page: number
        total_pages: number
        total_items: number
      }
    }

    return null
  }
)

export const GetRecruitment = cache(async (language_code: string) => {
  const response = await api.get(
    `/public/committee_positions/recruiting?language=${language_code}`
  )

  if (response.status === 200) {
    if (
      typeof response.data === 'object' &&
      Object.keys(response.data).length === 0
    ) {
      return []
    }
    return response.data as CommitteePositionRecruitment[]
  }

  return []
})

export const GetCommitteePositions = cache(
  async (type: 'committee' | 'independent', language_code: string) => {
    const response = await api.get(
      `/public/committee_positions?language=${language_code}&type=${type}`
    )

    if (response.status === 200) {
      return response.data as CommitteePosition[]
    }

    return []
  }
)
