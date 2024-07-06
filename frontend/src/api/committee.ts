import { cache } from 'react';
import api from './index';
import Committee, { CommitteeCategory } from '@/models/Committee';

export const GetCommitteePublic = cache(async (committee: string, language_code: string) => {
  const response = await api.get(`/public/committees/${committee}?language=${language_code}`);

  if (response.status === 200) {
      return response.data as Committee
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
  const response = await api.get(`/committees/${committee}/data`);

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
  const response = await api.get(`/public/committee_categories?language=${language_code}`);

  if (response.status === 200) {
      return response.data as CommitteeCategory[]
  }

  return null
})

export const GetCommitteeCategoryCommittees = cache(async (category: string, language_code: string) => {
  const response = await api.get(`/public/committee_categories/${category}?language=${language_code}&committees=True`);

  if (response.status === 200) {
      return response.data as CommitteeCategory & { committees: Committee[] }
  }

  return null
})