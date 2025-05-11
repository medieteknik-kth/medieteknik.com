import type { Committee, Student } from '@medieteknik/models'

export default interface Statistic {
  statistic_id: string
  year?: number
  month?: number
  is_all_time?: boolean
  value: number
  created_at: string
  updated_at: string
  student?: Student
  committee?: Committee
}

export interface TopStatistic {
  student: Student
  total_value: number
}

export interface MonthlyStatistic {
  month: number
  total_value: number
}
