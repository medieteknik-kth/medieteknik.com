import { GetCommitteePublic } from '@/api/committee'
import Committee from '@/models/Committee'
import { LanguageCode } from '@/models/Language'
import { Metadata } from 'next'
import CommitteePage from './committee'

interface Params {
  language: LanguageCode
  committee: string
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const value = decodeURI(params.committee)
  const committee_data: Committee | null = await GetCommitteePublic(
    params.committee,
    params.language
  )

  if (!committee_data) return { title: value.toUpperCase() }

  return {
    title: committee_data.translations[0].title,
    description: committee_data.translations[0].description || 'N/A',
    keywords: `${committee_data.translations[0].title}, committee, studentlife, management`,
    alternates: {
      canonical: `https://www.medieteknik.com/${params.language}/chapter/committees/${params.committee}`,
      languages: {
        sv: `https://www.medieteknik.com/sv/chapter/committees/${params.committee}`,
        en: `https://www.medieteknik.com/en/chapter/committees/${params.committee}`,
        'x-default': `https://www.medieteknik.com/chapter/committees/${params.committee}`,
      },
    },
  }
}

export default CommitteePage
