import { type ApiResponse, fetchData } from '@/api/api'
import type { LanguageCode } from '@/models/Language'
import type Student from '@/models/Student'
import type {
  IndividualCommitteePosition,
  Profile,
  StudentCommitteePosition,
} from '@/models/Student'

/**
 * @name getStudentPublic
 * @description Get student public data
 *
 * @param {string} studentId - The students email address
 * @param {LanguageCode} language_code - The language of retrieved data to be returned in
 * @param {boolean} detailed - Whether to return detailed data
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 24 hours)
 * @returns {Promise<ApiResponse<{ student: Student, profile?: Profile, memberships: IndividualCommitteePosition[] }>>} The API response with the student data or an error
 */
export const getStudentPublic = async (
  studentId: string,
  language_code: LanguageCode,
  detailed = false,
  revalidate = 86_400 // 24 hours
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
    `/public/students/${studentId}?language=${language_code}&detailed=${detailed}`,
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
 * @param {string} year - The date range to get officials for (YYYY)
 * @param {string} semester - The date range to get officials for ('HT' or 'VT')
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 1 hour)
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
    `/public/students/committee_members?language=${language_code}&year=${year}&semester=${semester}`,
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
