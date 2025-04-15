import {
  getCommitteesAllTime,
  getCommitteesYear,
} from '@/api/statistics/committee'
import {
  getStudentsOverTimeYear,
  getStudentsYear,
  getTopStudentsAllTime,
  getTopStudentsYear,
} from '@/api/statistics/students'
import StatisticsYear from '@/app/[language]/statistics/year/[year]/statistics'
import type { LanguageCode } from '@/models/Language'
import type Statistic from '@/models/Statistic'
import type { MonthlyStatistic, TopStatistic } from '@/models/Statistic'

interface Params {
  language: LanguageCode
  year: number
}

interface Props {
  params: Promise<Params>
}

export default async function StatisticYearData(props: Props) {
  const { language, year } = await props.params

  const data = await Promise.all([
    getCommitteesAllTime(language, false),
    getCommitteesYear(language, year, false),
    getTopStudentsAllTime(language, false),
    getTopStudentsYear(language, year, false),
    getStudentsYear(language, year, false),
    getStudentsOverTimeYear(language, year, false),
  ])

  const [
    committeeAllTime,
    committeeYear,
    topStudentsAllTime,
    topStudentYear,
    studentsYear,
    monthlyStatistics,
  ] = data.map((item) => {
    if (item.error) {
      throw new Error(item.error.message)
    }
    return item.data
  })

  return (
    <StatisticsYear
      language={language}
      providedYear={year.toString()}
      allTimeCommitteesStatistics={committeeAllTime as Statistic[]}
      yearCommitteesStatistics={committeeYear as Statistic[]}
      allTimeTopStudentsStatistics={topStudentsAllTime as TopStatistic[]}
      yearTopStudentsStatistics={topStudentYear as TopStatistic[]}
      yearStudentsStatistics={studentsYear as Statistic[]}
      monthlyStatistics={monthlyStatistics as MonthlyStatistic[]}
    />
  )
}
