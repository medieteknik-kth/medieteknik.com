import { type ApiResponse, fetchData } from '@/api/api'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import type { StudentCommitteePositionPagination } from '@/models/Pagination'

/**
 * @name getPublicCommitteeData
 * @description Get the public data for a committee
 *
 * @param {string} committee - The committee to get data for
 * @param {LanguageCode} language_code - The language to get the data in
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 1 hour)
 * @returns {Promise<ApiResponse<Committee>>} The API response with the committee data or an error
 */
export const getPublicCommitteeData = async (
  committee: string,
  language_code?: LanguageCode,
  revalidate = 3_600 // 1 hour
): Promise<ApiResponse<Committee>> => {
  const { data, error } = await fetchData<Committee>(
    `/public/committees/${committee}${
      language_code ? `?language=${language_code}` : ''
    }`,
    {
      next: {
        revalidate: revalidate,
      },
    }
  )

  if (error) {
    return { data, error }
  }

  return { data: { ...data, author_type: 'COMMITTEE' }, error: null }
}

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
  revalidate = 86_400 // 24 hours
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

/**
 * @name getCommitteeMembers
 * @description Get the members of a committee
 *
 * @param {string} committee - The committee to get members for
 * @param {LanguageCode} language_code - The language to get the data in
 * @param {number} page - The page number to get
 * @param {number} per_page - The number of items per page (default: 25)
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 1 hour)
 * @returns {Promise<ApiResponse<StudentCommitteePositionPagination>>} The API response with the members or an error
 */
export const getCommitteeMembers = async (
  committee: string,
  language_code: LanguageCode,
  date?: string,
  officials = false,
  page = 1,
  per_page = 25,
  revalidate = 3_600
): Promise<ApiResponse<StudentCommitteePositionPagination>> => {
  const { data, error } = await fetchData<StudentCommitteePositionPagination>(
    `/public/committees/${committee}/members?language=${language_code}&page=${page}&per_page=${per_page}${date ? `&snapshot_date=${date}` : ''}&officials=${officials}`,
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
