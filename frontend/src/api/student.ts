import { type ApiResponse, fetchData } from '@/api/api'
import type { LanguageCode } from '@/models/Language'
import type { EventPagniation, NewsPagination } from '@/models/Pagination'
import type Student from '@/models/Student'
import type {
  IndividualCommitteePosition,
  Profile,
  StudentCommitteePosition,
} from '@/models/Student'
import { API_BASE_URL } from '@/utility/Constants'

/**
 * @name getStudentPublic
 * @description Get student public data
 *
 * @param {string} studentId - The students email address
 * @param {LanguageCode} language_code - The language of retrieved data to be returned in
 * @param {boolean} detailed - Whether to return detailed data
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 1 hour)
 * @returns {Promise<ApiResponse<{ student: Student, profile?: Profile, memberships: IndividualCommitteePosition[] }>>} The API response with the student data or an error
 */
export const getStudentPublic = async (
  studentId: string,
  language_code: LanguageCode,
  detailed = false,
  revalidate = 3_600
): Promise<
  ApiResponse<{
    student: Student
    profile?: Profile
    memberships: IndividualCommitteePosition[]
  }>
> => {
  const { data, error } = await fetchData<{
    student: Student
    profile?: Profile
    memberships: IndividualCommitteePosition[]
  }>(
    `${API_BASE_URL}/public/students/${studentId}?language=${language_code}&detailed=${detailed}`,
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
 * @name getStudentNews
 * @description Get the news for a specific student
 *
 * @param {string} student_email - The students email address
 * @param {LanguageCode} language_code - The language of retrieved data to be returned in
 * @returns {Promise<ApiResponse<NewsPagination>>} The API response with the news or an error
 */
export const getStudentNews = async (
  student_email: string,
  language_code: LanguageCode,
  revalidate = 3_600
): Promise<ApiResponse<NewsPagination>> => {
  const { data, error } = await fetchData<NewsPagination>(
    `${API_BASE_URL}/public/news/student/${student_email}?language=${language_code}`,
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
 * @name getStudentEvents
 * @description Get the events for a specific student
 *
 * @param {string} student_email - The students email address
 * @param {LanguageCode} language_code - The language of retrieved data to be returned in
 * @returns {Promise<ApiResponse<EventPagniation>>} The API response with the events or an error
 */
export const getStudentEvents = async (
  student_email: string,
  language_code: LanguageCode,
  revalidate = 3_600
): Promise<ApiResponse<EventPagniation>> => {
  const { data, error } = await fetchData<EventPagniation>(
    `${API_BASE_URL}/public/events/student/${student_email}?language=${language_code}`,
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
 * @name getOfficials
 * @description Get the officials for a specific language and date
 *
 * @param {LanguageCode} language_code - The language to get officials in
 * @param {string} year - The date range to get officials for (e.g. '2024-2025')
 * @returns {Promise<ApiResponse<StudentCommitteePosition[]>>} The API response with the officials or an error
 */
export const getOfficials = async (
  language_code: LanguageCode,
  year: string,
  semester: string,
  revalidate = 3_600
): Promise<ApiResponse<StudentCommitteePosition[]>> => {
  // TODO: Change the API endpoint to something like this '/public/officials/'?
  const { data, error } = await fetchData<StudentCommitteePosition[]>(
    `${API_BASE_URL}/public/students/committee_members?language=${language_code}&year=${year}&semester=${semester}`,
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
