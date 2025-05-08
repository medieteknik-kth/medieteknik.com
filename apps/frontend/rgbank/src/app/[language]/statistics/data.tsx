import {
  getAllYears,
  getCommitteesAllTime,
  getCommitteesYear,
} from '@/api/statistics/committee'
import Statistics from '@/app/[language]/statistics/statistics'
import type Statistic from '@/models/Statistic'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { getYear } from 'date-fns'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

export default async function StatisticData(props: Props) {
  const { language } = await props.params
  const currentYear = getYear(new Date())

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

  const [allYears, committeeAllTime, committeeYear] = results.map((result) =>
    'data' in result ? result.data : []
  )

  return (
    <Statistics
      language={language}
      allYears={allYears as number[]}
      allTimeCommitteesStatistics={committeeAllTime as Statistic[]}
      yearCommitteesStatistics={committeeYear as Statistic[]}
    />
  )
}
