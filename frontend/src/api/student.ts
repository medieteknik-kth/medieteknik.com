import {
  EventPagniation,
  NewsPagination,
  StudentPagination,
} from '@/models/Pagination'
import Student, {
  IndividualCommitteePosition,
  Profile,
  StudentCommitteePosition,
  StudentMembership,
} from '@/models/Student'
import { cache } from 'react'
import api from './index'

export const GetStudentPublic = cache(
  async (student: string, language_code: string, detailed: boolean = false) => {
    const response = await api.get(
      `/public/students/${student}?language=${language_code}&detailed=${detailed}`
    )

    if (response.status === 200) {
      return response.data as {
        student: Student
        profile?: Profile
        memberships: IndividualCommitteePosition[]
      }
    }

    return null
  }
)

export const GetStudents = cache(async () => {
  const response = await api.get(`/public/student`)

  if (response.status === 200) {
    return response.data as StudentPagination
  }

  return null
})

export const GetStudentNews = cache(
  async (student_email: string, language_code: string) => {
    const response = await api.get(
      `/public/news/student/${student_email}?language=${language_code}`
    )

    if (response.status === 200) {
      return response.data as NewsPagination
    }

    return null
  }
)

export const GetStudentEvents = cache(
  async (student_email: string, language_code: string) => {
    const response = await api.get(
      `/public/events/student/${student_email}?language=${language_code}`
    )

    if (response.status === 200) {
      return response.data as EventPagniation
    }

    return null
  }
)

export const GetCommitteeMembers = cache(
  async (language_code: string, date: string) => {
    const response = await api.get(
      `/public/students/committee_members?language=${language_code}&date=${date}`
    )

    if (response.status === 200) {
      return response.data as StudentCommitteePosition[]
    }

    return null
  }
)
