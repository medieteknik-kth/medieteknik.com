import { Media, News } from '@/models/Items';
import { MediaPagination, NewsPagination } from '@/models/Pagination';
import { cache } from 'react';
import api from './index';


export const GetBreakingNews = cache(async (language_code: string) => {
  const response = await api.get(`/public/news/latest?language=${language_code}`);

  if (response.status === 200) {
    if (typeof response.data === 'object' && Object.keys(response.data).length === 0) {
      return []
    }
    return response.data as News[]
  }

  return []
})

export const GetNewsPagniation = cache(async (language_code: string, page: number) => {
  const response = await api.get(`/public/news?page=${page}&language=${language_code}`);

  if (response.status === 200) {
    return response.data as NewsPagination
  }

  return null
})

export const GetNewsData = cache(async (language_code: string, slug: string) => {
  const encodedSlug = encodeURIComponent(slug)
  try {
    const response = await api.get(`/public/news/${encodedSlug}?language=${language_code}`)

    if (response.status === 200) {
      return response.data as News
    }
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null
    }
    throw error
  }

  return null
})

export const GetMediaData = cache(async (language_code: string, committee_id: string) => {
  try {
    const response = await api.get(`/public/media/author/${committee_id}?language=${language_code}`)

    if (response.status === 200) {
      return response.data as MediaPagination
    }
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null
    }
    throw error
  }

  return null
})

export const GetLatestMedia = cache(async (language_code: string) => {
  const response = await api.get(`/public/media/latest?language=${language_code}`);

  if (response.status === 200) {
    return response.data as Media[]
  }

  return null
})