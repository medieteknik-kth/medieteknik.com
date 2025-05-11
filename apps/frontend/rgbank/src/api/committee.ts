import { type ApiResponse, fetchData } from '@medieteknik/api'
import type { Committee } from '@medieteknik/models'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'

/**
 * @name getAllCommittees
 * @description Get all the committees
 *
 * @param {LanguageCode} language_code - The language to get the data in
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 24 hours)
 * @returns {Promise<ApiResponse<Committee[]>>} The API response with the committees or an error
 */
export const getAllCommittees = async (
  language_code: LanguageCode,
  revalidate = 2_678_400 // 24 hours
): Promise<ApiResponse<Committee[]>> => {
  const { data, error } = await fetchData<Committee[]>(
    `/public/committees${language_code ? `?language=${language_code}` : ''}`,
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
