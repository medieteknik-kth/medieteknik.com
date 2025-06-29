import { type ApiResponse, fetchData } from '@/api/api'
import type { LanguageCode } from '@/models/Language'
import type { NewsPagination } from '@/models/Pagination'
import type News from '@/models/items/News'

/**
 * @name getNewsPagniation
 * @description Get the news pagination for a specific language and page
 *
 * @param {LanguageCode} language_code - The language to get news in
 * @param {number} page - The page number to get news from
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 1 hour)
 * @returns {Promise<ApiResponse<NewsPagination>>} The API response with the news pagination or an error
 */
export const getNewsPagniation = async (
  language_code: LanguageCode,
  page: number,
  revalidate = 3_600
): Promise<ApiResponse<NewsPagination>> => {
  const { data, error } = await fetchData<NewsPagination>(
    `/public/news?page=${page}&language=${language_code}`,
    {
      next: {
        revalidate: revalidate, // 1 hour or user defined
      },
    }
  )

  if (error) {
    return { data, error }
  }

  return { data, error: null }
}

/**
 * @name getNewsData
 * @description Get static news data for a specific language and slug
 *
 * @param {LanguageCode} language_code - The language to get news in
 * @param {string} slug - The slug of the news to get
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 24 hours)
 * @returns {Promise<ApiResponse<News>>} The API response with the news data or an error
 */
export const getNewsData = async (
  language_code: LanguageCode,
  slug: string,
  revalidate = 86_400 // 24 hours
): Promise<ApiResponse<News>> => {
  const encodedSlug = encodeURIComponent(slug)
  const { data, error } = await fetchData<News>(
    `/public/news/${encodedSlug}?language=${language_code}`,
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
