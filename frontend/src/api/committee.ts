import { cache } from 'react';
import api from './index';
import Committee, { CommitteeCategory, CommitteePosition } from '@/models/Committee';
import Student from '@/models/Student';

export const GetCommitteePublic = cache(async (committee: string, language_code?: string) => {
  const response = await api.get(`/public/committees/${committee}${language_code ? `?language=${language_code}` : ``}`,);

  if (response.status === 200) {
    const data = response.data
    data.author_type = 'COMMITTEE'
    return data as Committee
  }

  return null
})

export const GetAllCommittees = cache(async (language_code?: string) => {
  const response = await api.get(`/public/committees${language_code ? `?language=${language_code}` : `` }`);

  if (response.status === 200) {
      return response.data as Committee[]
  }

  return null
})

export const GetCommittee = cache(async (committee: string, language_code: string) => {
  const response = await api.get(`/committees/${committee}?language=${language_code}`);

  if (response.status === 200) {
      return response.data as Committee
  }

  return null
})

export const GetCommitteeData = cache(async (committee: string) => {
  const response = await api.get(`/committees/${committee}/data`, {
    withCredentials: true
  });

  if (response.status === 200) {
      return response.data as {
        members: {
          ids: string[],
          total: number
        },
        positions: {
          ids: string[],
          total: number
        },
        news: {
          ids: string[],
          total: number
        },
        events: {
          ids: string[],
          total: number
        },
        documents: {
          ids: string[],
          total: number
        },
        albums: {
          ids: string[],
          total: number
        }
      }
  }

  return null
})

export const GetCommitteeCategories = cache(async (language_code: string) => {
  try {
    const response = await api.get(`/public/committee_categories?language=${language_code}`);
  
    if (response.status === 200) {
        return response.data as CommitteeCategory[]
    }
  
    return null
  } catch (error) {
    console.error(error)
    return null
    
  }
})

export const GetCommitteeCategoryCommittees = cache(async (category: string, language_code: string) => {
  const response = await api.get(`/public/committee_categories/${category}?language=${language_code}&committees=True`);

  if (response.status === 200) {
      return response.data as CommitteeCategory & { committees: Committee[] }
  }

  return null
})

export const GetCommitteeMembers = cache(async (committee: string, language_code: string, page: number, per_page: number = 25) => {
  const response = await api.get(`public/committees/${committee}/members?language=${language_code}&page=${page}&per_page=${per_page}`);

  if (response.status === 200) {
      return response.data as {
        items: {
          student: Student
          position: CommitteePosition
          initation_date: string
          end_date: string
        }[],
        page: number
        per_page: number
        total_pages: number
        total_items: number
        }
  }

  return null
})

interface RecruitmentResponse {
  committee_position: CommitteePosition
  start_date: string
  end_date: string
  translations: { description: string; link_url: string }[]
}

export const GetRecruitment = cache(async (language_code: string) => {
  const response = await api.get(`/public/committee_positions/recruiting?language=${language_code}`)

  if (response.status === 200) {
    if (typeof response.data === 'object' && Object.keys(response.data).length === 0) {
      return []
    }
    return response.data as RecruitmentResponse[]
  }

  return []
})
