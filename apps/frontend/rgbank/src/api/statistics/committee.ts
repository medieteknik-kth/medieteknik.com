import { fetchData } from '@/api/api'
import type { LanguageCode } from '@/models/Language'
import type Statistic from '@/models/Statistic'

export const getAllYears = async (
  revalidate: number | false = 604_800 // 7 days
) => {
  const { data, error } = await fetchData<number[]>(
    '/public/rgbank/statistics/years',
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

export const getCommitteesAllTime = async (
  language_code: LanguageCode,
  revalidate: number | false = 604_800 // 7 days
) => {
  const { data, error } = await fetchData<Statistic[]>(
    `/public/rgbank/statistics/commitees/all_time${
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

export const getCommitteesYear = async (
  language_code: LanguageCode,
  year: number,
  revalidate: number | false = 604_800 // 7 days
) => {
  const { data, error } = await fetchData<Statistic[]>(
    `/public/rgbank/statistics/commitees/year/${year}${
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

export const getCommitteesMonth = async (
  language_code: LanguageCode,
  year: number,
  month: number,
  revalidate: number | false = 604_800 // 7 days
) => {
  const { data, error } = await fetchData<Statistic[]>(
    `/public/rgbank/statistics/commitees/year/${year}/month/${month}${
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
