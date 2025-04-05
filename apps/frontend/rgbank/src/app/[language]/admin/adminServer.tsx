import { getAllCommittees } from '@/api/committee'
import Admin from '@/app/[language]/admin/admin'
import type { LanguageCode } from '@/models/Language'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

export default async function AdminServer(props: Props) {
  const { language } = await props.params
  const { data: committees, error: committeesError } =
    await getAllCommittees(language)

  if (committeesError) {
    return <div>Error fetching committees</div>
  }

  return <Admin language={language} committees={committees} />
}
