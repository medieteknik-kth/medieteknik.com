import { type ApiResponse, fetchData } from '@/api/api'
import type {
  CommitteePosition,
  CommitteePositionRecruitment,
} from '@/models/Committee'
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
  revalidate = 86_400 // 24 hours
): Promise<ApiResponse<CommitteePosition[]>> => {
  const { data, error } = await fetchData<CommitteePosition[]>(
    `${API_BASE_URL}/public/committee_positions?language=${language_code}&type=${type}`,
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

/**
 * @name getRecruitment
 * @description Get the recruitment data for committee positions
 *
 * @param {LanguageCode} language_code - The language to get the data in
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 1 hour)
 * @returns {Promise<ApiResponse<CommitteePositionRecruitment[]>>} The API response with the recruitment data or an error
 */
export const getRecruitment = async (
  language_code: LanguageCode,
  revalidate = 1_800
): Promise<ApiResponse<CommitteePositionRecruitment[]>> => {
  const { data, error } = await fetchData<CommitteePositionRecruitment[]>(
    `${API_BASE_URL}/public/committee_positions/recruiting?language=${language_code}`,
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
