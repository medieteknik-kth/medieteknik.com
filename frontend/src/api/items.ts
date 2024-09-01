import { cache } from 'react';
import api from './index';
import { News } from '@/models/Items';
import { NewsPagination } from '@/models/Pagination';


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