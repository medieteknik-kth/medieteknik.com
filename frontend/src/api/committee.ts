import { ApiResponse, fetchData } from '@/api/api'
import Committee, {
  CommitteeData,
  CommitteePositionRecruitment,
} from '@/models/Committee'
import { LanguageCode } from '@/models/Language'
import { StudentCommitteePositionPagination } from '@/models/Pagination'
import { API_BASE_URL } from '@/utility/Constants'

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
  revalidate: number = 3_600
): Promise<ApiResponse<Committee>> => {
  const { data, error } = await fetchData<Committee>(
    `${API_BASE_URL}/public/committees/${committee}${
      language_code ? `?language=${language_code}` : ``
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

  return { data, error: null }
}

/**
 * @name getAllCommittees
 * @description Get all the committees
 *
 * @param {LanguageCode} language_code - The language to get the data in
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 1 hour)
 * @returns {Promise<ApiResponse<Committee[]>>} The API response with the committees or an error
 */
export const getAllCommittees = async (
  language_code?: LanguageCode,
  revalidate: number = 3_600
): Promise<ApiResponse<Committee[]>> => {
  const { data, error } = await fetchData<Committee[]>(
    `${API_BASE_URL}/public/committees${
      language_code ? `?language=${language_code}` : ``
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

  return { data, error: null }
}

/**
 * @name getCommittee
 * @description Get the data for a committee
 *
 * @param {string} committee - The committee to get data for
 * @param {LanguageCode} language_code - The language to get the data in
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 1 hour)
 * @returns {Promise<ApiResponse<Committee>>} The API response with the committee data or an error
 */
export const getCommittee = async (
  committee: string,
  language_code: LanguageCode,
  revalidate: number = 3_600
): Promise<ApiResponse<Committee>> => {
  const { data, error } = await fetchData<Committee>(
    `${API_BASE_URL}/committees/${committee}?language=${language_code}`,
    {
      credentials: 'include',
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
 * @name getCommitteeData
 * @description Get the "private" data for a committee
 *
 * @param {string} committee - The committee to get data for
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 1 hour)
 * @returns {Promise<ApiResponse<CommitteeData>>} The API response with the committee data or an error
 */
export const getCommitteeData = async (
  committee: string,
  revalidate: number = 3_600
): Promise<ApiResponse<CommitteeData>> => {
  const { data, error } = await fetchData<CommitteeData>(
    `${API_BASE_URL}/committees/${committee}/data`,
    {
      credentials: 'include',
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
  page: number,
  per_page: number = 25,
  revalidate: number = 3_600
): Promise<ApiResponse<StudentCommitteePositionPagination>> => {
  const { data, error } = await fetchData<StudentCommitteePositionPagination>(
    `${API_BASE_URL}/public/committees/${committee}/members?language=${language_code}&page=${page}&per_page=${per_page}`,
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
  revalidate: number = 3_600
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
