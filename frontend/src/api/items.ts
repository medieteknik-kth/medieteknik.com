import { News } from '@/models/Items';
import { NewsPagination } from '@/models/Pagination';
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
  try {
    const response = await api.get(`/public/news/${slug}?language=${language_code}`)

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