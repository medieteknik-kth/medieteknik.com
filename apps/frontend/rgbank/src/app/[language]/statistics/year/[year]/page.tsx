import StatisticYearData from '@/app/[language]/statistics/year/[year]/data'
import { SUPPORTED_LANGUAGES } from '@/utility/Constants'
import { getYear } from 'date-fns'

export const dynamicParams = false

export async function generateStaticParams() {
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.API_URL
  const response = await fetch(`${baseUrl}/public/rgbank/statistics/years`, {
    headers: {
      Authorization: `Bearer ${process.env.AUTHORIZATION_TOKEN}`,
    },
  })

  if (!response.ok) {
    return []
  }

  const years = (await response.json()) as number[]
  const supportedYears = years.filter((year) => year !== getYear(new Date()))

  if (supportedYears.length === 0) {
    return []
  }

  const paths = SUPPORTED_LANGUAGES.flatMap((language) =>
    supportedYears.map((year) => ({
      language,
      year,
    }))
  )
  return paths
}

export default StatisticYearData
