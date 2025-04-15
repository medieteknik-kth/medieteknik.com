import {
  getAllYears,
  getCommitteesAllTime,
  getCommitteesYear,
} from '@/api/statistics/committee'
import {
  getStudentsMonth,
  getStudentsOverTimeYear,
  getStudentsYear,
  getTopStudentsAllTime,
  getTopStudentsYear,
} from '@/api/statistics/students'
import Statistics from '@/app/[language]/statistics/statistics'
import type { LanguageCode } from '@/models/Language'
import type Statistic from '@/models/Statistic'
import type { MonthlyStatistic, TopStatistic } from '@/models/Statistic'
import { getMonth, getYear, subMonths } from 'date-fns'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

export default async function StatisticData(props: Props) {
  const { language } = await props.params
  const currentYear = getYear(new Date())
  const currentMonth = getMonth(new Date()) + 1

  const statisticsFetchers = [
    {
      key: 'committeeAllTime',
      fetcher: () => getAllYears(),
    },
    {
      key: 'committeeAllTime',
      fetcher: () => getCommitteesAllTime(language, 10),
    },
    {
      key: 'committeeYear',
      fetcher: () => getCommitteesYear(language, currentYear, 10),
    },
    {
      key: 'topStudentsAllTime',
      fetcher: () => getTopStudentsAllTime(language, 10),
    },
    {
      key: 'topStudentYear',
      fetcher: () => getTopStudentsYear(language, currentYear, 10),
    },
    {
      key: 'studentsYear',
      fetcher: () => getStudentsYear(language, currentYear, 10),
    },
    {
      key: 'studentsMonth',
      fetcher: () => getStudentsMonth(language, currentYear, currentMonth, 10),
    },
    {
      key: 'studentsPreviousMonth',
      fetcher: () =>
        getStudentsMonth(
          language,
          currentYear,
          getMonth(subMonths(new Date(), 1)) + 1,
          10
        ),
    },
    {
      key: 'monthlyStatistics',
      fetcher: () => getStudentsOverTimeYear(language, currentYear, 10),
    },
  ]

  const results = await Promise.all(
    statisticsFetchers.map(({ fetcher }) =>
      fetcher().catch((error) => ({ error }))
    )
  )

  const errors = results.filter((result) => result.error)
  if (errors.length > 0) {
    console.error('Error loading statistics', ...errors.map((e) => e.error))
    return (
      <div className='h-screen grid place-items-center'>
        Error loading statistics
      </div>
    )
  }

  const [
    allYears,
    committeeAllTime,
    committeeYear,
    topStudentsAllTime,
    topStudentYear,
    studentsYear,
    studentsMonth,
    studentsPreviousMonth,
    monthlyStatistics,
  ] = results.map((result) => ('data' in result ? result.data : []))

  return (
    <Statistics
      language={language}
      allYears={allYears as number[]}
      allTimeCommitteesStatistics={committeeAllTime as Statistic[]}
      yearCommitteesStatistics={committeeYear as Statistic[]}
      allTimeTopStudentsStatistics={topStudentsAllTime as TopStatistic[]}
      yearTopStudentsStatistics={topStudentYear as TopStatistic[]}
      yearStudentsStatistics={studentsYear as Statistic[]}
      monthStudentsStatistics={studentsMonth as Statistic[]}
      previousMonthStudentsStatistics={studentsPreviousMonth as Statistic[]}
      monthlyStatistics={monthlyStatistics as MonthlyStatistic[]}
    />
  )
}
