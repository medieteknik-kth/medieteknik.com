import type Statistic from '@/models/Statistic'
import type { MonthlyStatistic, TopStatistic } from '@/models/Statistic'
import { fetchData } from '@medieteknik/api'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'

export const getTopStudentsAllTime = async (
  language_code: LanguageCode,
  revalidate: number | false = 604_800 // 7 days
) => {
  const { data, error } = await fetchData<TopStatistic[]>(
    `/public/rgbank/statistics/students/top/all_time${
      language_code ? `?language=${language_code}` : ''
    }`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTHORIZATION_TOKEN}`,
      },
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

export const getTopStudentsYear = async (
  language_code: LanguageCode,
  year: number,
  revalidate: number | false = 604_800 // 7 days
) => {
  const { data, error } = await fetchData<TopStatistic[]>(
    `/public/rgbank/statistics/students/top/year/${year}${
      language_code ? `?language=${language_code}` : ''
    }`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTHORIZATION_TOKEN}`,
      },
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

export const getStudentsYear = async (
  language_code: LanguageCode,
  year: number,
  revalidate: number | false = 604_800 // 7 days
) => {
  const { data, error } = await fetchData<Statistic[]>(
    `/public/rgbank/statistics/students/year/${year}${
      language_code ? `?language=${language_code}` : ''
    }`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTHORIZATION_TOKEN}`,
      },
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

export const getTopStudentsMonth = async (
  language_code: LanguageCode,
  year: number,
  month: number,
  revalidate: number | false = 604_800 // 7 days
) => {
  const { data, error } = await fetchData<TopStatistic[]>(
    `/public/rgbank/statistics/students/top/year/${year}/month/${month}${
      language_code ? `?language=${language_code}` : ''
    }`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTHORIZATION_TOKEN}`,
      },
      cache: revalidate === false ? 'force-cache' : 'default',
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

export const getStudentsMonth = async (
  language_code: LanguageCode,
  year: number,
  month: number,
  revalidate: number | false = 604_800 // 7 days
) => {
  const { data, error } = await fetchData<Statistic[]>(
    `/public/rgbank/statistics/students/year/${year}/month/${month}${
      language_code ? `?language=${language_code}` : ''
    }`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTHORIZATION_TOKEN}`,
      },
      cache: revalidate === false ? 'force-cache' : 'default',
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

export const getStudentsOverTimeYear = async (
  language_code: LanguageCode,
  year: number,
  revalidate: number | false = 604_800 // 7 days
) => {
  const { data, error } = await fetchData<MonthlyStatistic[]>(
    `/public/rgbank/statistics/students/over_time/year/${year}${
      language_code ? `?language=${language_code}` : ''
    }`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTHORIZATION_TOKEN}`,
      },
      cache: revalidate === false ? 'force-cache' : 'default',
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
