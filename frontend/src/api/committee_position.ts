import { type ApiResponse, fetchData } from '@/api/api'
import type { CommitteePosition } from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { API_BASE_URL } from '@/utility/Constants'

/**
 * @name getCommitteePositions
 * @description Get the committee positions for a specific type and language
 *
 * @param {'committee' | 'independent'} type - The type of committee positions to get
 * @param {LanguageCode} language_code - The language to get committee positions in
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 30 days)
 * @returns {Promise<ApiResponse<CommitteePosition[]>>} The API response with the committee positions or an error
 */
export const getCommitteePositions = async (
  type: 'committee' | 'independent',
  language_code: LanguageCode,
  revalidate = 2_592_000
): Promise<ApiResponse<CommitteePosition[]>> => {
  const { data, error } = await fetchData<CommitteePosition[]>(
    `${API_BASE_URL}/public/committee_positions?language=${language_code}&type=${type}`,
    {
      next: {
        revalidate: revalidate, // 30 days or user defined
      },
    }
  )

  if (error) {
    return { data, error }
  }

  return { data, error: null }
}
