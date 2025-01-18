import type { LanguageCode } from '@/models/Language'
import type { Metadata } from 'next'
import CommitteeManage from './manage'

interface Params {
  language: LanguageCode
  committee: string
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const value = decodeURI(params.committee)

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: `${capitalizedValue} - Management`,
    robots: 'noindex, nofollow',
  }
}

export default CommitteeManage
