import { type ApiResponse, fetchData } from '@/api/api'
import type { AlbumTranslation } from '@/models/Album'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import type Student from '@/models/Student'

/**
 * @name SearchResponse
 * @description The response from the search API, containing the list of albums, committee positions, committees, documents, media, and news
 *
 * @interface {Object} SearchResponse
 * @property {Array<{ translation: AlbumTranslation, updated_at: string }>} albums - The list of albums
 * @property {Array<{ email: string, committee?: { email: string, logo_url: string, title: string }, translation: { description: string, language_code: string, title: string } }>} committee_positions - The list of committee positions
 * @property {Array<{ email: string, logo_url: string, translation: { description: string, language_code: string, title: string } }>} committees - The list of committees
 * @property {Array<{ author: Student | Committee, created_at: string, last_updated: string, translation: { categories: string[] | null, language_code: string, title: string, url: string } }>} documents - The list of documents
 * @property {Array<{ author: Student | Committee, created_at: string, last_updated: string, translation: { description: string, language_code: string, title: string } }>} media - The list of media
 * @property {Array<{ author: Student | Committee, url: string, last_updated: string, created_at: string, translation: { title: string, main_image_url?: string, language_code: string, short_description: string } }>} news - The list of news
 */
export interface SearchResponse {
  albums: {
    translation: AlbumTranslation
    updated_at: string
  }[]
  committee_positions: {
    email: string
    committee?: {
      email: string
      logo_url: string
      title: string
    }
    translation: {
      description: string
      language_code: string
      title: string
    }
  }[]
  committees: {
    email: string
    logo_url: string
    translation: {
      description: string
      language_code: string
      title: string
    }
  }[]
  documents: {
    author: Student | Committee
    created_at: string
    last_updated: string
    translation: {
      categories: string[] | null
      language_code: string
      title: string
      url: string
    }
  }[]
  media: {
    author: Student | Committee
    created_at: string
    last_updated: string
    translation: {
      description: string
      language_code: string
      title: string
    }
  }[]
  news: {
    author: Student | Committee
    url: string
    last_updated: string
    created_at: string
    translation: {
      title: string
      main_image_url?: string
      language_code: string
      short_description: string
    }
  }[]
}

/**
 * @name getSearchEntries
 * @description Fetches the search entries from the API every 24 hours
 *
 * @param {LanguageCode} language - The current language of the page
 * @param {number} revalidate - The revalidation time in seconds, default is 24 hours
 *
 * @returns {Promise<ApiResponse<SearchResponse>>} - The search entries
 */
export const getSearchEntries = async (
  language: LanguageCode,
  revalidate = 86_400 // 24 hours
): Promise<ApiResponse<SearchResponse>> => {
  const { data, error } = await fetchData<SearchResponse>(
    `/public/search?language=${language}`,
    {
      next: {
        revalidate: revalidate,
      },
    }
  )

  if (error) {
    return { data, error }
  }

  return { data, error: null }
}
