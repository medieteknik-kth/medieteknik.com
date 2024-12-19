import { fetchData } from '@/api/api'
import type Committee from '@/models/Committee'
import type { CommitteeCategory } from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { API_BASE_URL } from '@/utility/Constants'

export async function getCommitteeCategories(
  language: LanguageCode,
  revalidate = 7_776_000
) {
  const { data, error } = await fetchData<CommitteeCategory[]>(
    `${API_BASE_URL}/public/committee_categories?language=${language}`,
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

export async function getCommitteesForCategory(
  category: string,
  language: LanguageCode,
  revalidate = 2_592_000
) {
  const { data, error } = await fetchData<
    CommitteeCategory & { committees: Committee[] }
  >(
    `${API_BASE_URL}/public/committee_categories/${category}?language=${language}&committees=True`,
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
