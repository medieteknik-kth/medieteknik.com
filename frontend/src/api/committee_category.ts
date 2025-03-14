import { fetchData } from '@/api/api'
import type Committee from '@/models/Committee'
import type { CommitteeCategory } from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { API_BASE_URL } from '@/utility/Constants'

export async function getCommitteeCategories(
  language: LanguageCode,
  revalidate = 604_800 // 7 days
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
  revalidate = 86_400 // 24 hours
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
