import Album from '@/models/Album'
import Media from '@/models/items/Media'
import News from '@/models/items/News'
import {
  AlbumPagination,
  MediaPagination,
  NewsPagination,
} from '@/models/Pagination'
import { cache } from 'react'
import api from './index'

export const GetBreakingNews = cache(async (language_code: string) => {
  const response = await api.get(
    `/public/news/latest?language=${language_code}`
  )

  if (response.status === 200) {
    if (
      typeof response.data === 'object' &&
      Object.keys(response.data).length === 0
    ) {
      return []
    }
    return response.data as News[]
  }

  return []
})

export const GetNewsPagniation = cache(
  async (language_code: string, page: number) => {
    const response = await api.get(
      `/public/news?page=${page}&language=${language_code}`
    )

    if (response.status === 200) {
      return response.data as NewsPagination
    }

    return null
  }
)

export const GetNewsData = cache(
  async (language_code: string, slug: string) => {
    const encodedSlug = encodeURIComponent(slug)
    try {
      const response = await api.get(
        `/public/news/${encodedSlug}?language=${language_code}`
      )

      if (response.status === 200) {
        return response.data as News
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null
      }
      throw error
    }

    return null
  }
)

export const GetMediaData = cache(
  async (language_code: string, committee_id: string) => {
    try {
      const response = await api.get(
        `/public/media/author/${committee_id}?language=${language_code}`
      )

      if (response.status === 200) {
        return response.data as MediaPagination
      }
      return null
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (_) {
      return null
    }
  }
)

export const GetAlbums = cache(async (language_code: string) => {
  try {
    const response = await api.get(`/public/albums?language=${language_code}`)

    if (response.status === 200) {
      return response.data as AlbumPagination
    }

    return null
  } catch (error) {
    console.error(error)
    return null
  }
})

export const GetAlbum = cache(async (language_code: string, slug: string) => {
  try {
    const response = await api.get(
      `/public/albums/${slug}?language=${language_code}`
    )

    if (response.status === 200) {
      return response.data as {
        album: Album
        media: Media[]
      }
    }
    return null
  } catch (_) {
    return null
  }
})

export const GetLatestMedia = cache(async (language_code: string) => {
  try {
    const response = await api.get(
      `/public/media/latest?language=${language_code}`
    )

    if (response.status === 200) {
      return response.data as Media[]
    }

    return null
  } catch (error) {
    console.error(error)
    return null
  }
})
