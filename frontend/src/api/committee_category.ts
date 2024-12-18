import { fetchData } from '@/api/api'
import Committee, { CommitteeCategory } from '@/models/Committee'
import { LanguageCode } from '@/models/Language'
import { API_BASE_URL } from '@/utility/Constants'

export async function getCommitteeCategories(
  language: LanguageCode,
  revalidate: number = 7_776_000
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
  revalidate: number = 2_592_000
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
