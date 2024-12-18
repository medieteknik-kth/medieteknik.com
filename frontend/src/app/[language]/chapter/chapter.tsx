import { getAllCommittees } from '@/api/committee'
import { getOfficials } from '@/api/student'
import { useTranslation } from '@/app/i18n'
import { HeadComponent } from '@/components/static/Static'
import Committees from './committees'
import Officials from './officials'

interface Params {
  language: string
}

interface Props {
  params: Promise<Params>
}

export default async function Chapter(props: Props) {
  const { language } = await props.params
  const { data: committees } = await getAllCommittees(language)
  const { data: members } = await getOfficials(language, '2024-2025')

  const { t } = await useTranslation(language, 'chapter')

  return (
    <main
      style={{
        scrollPaddingTop: '-20rem !important',
        scrollMarginTop: '-20rem !important',
      }}
    >
      <HeadComponent title={t('title')} description={t('description')} />
      <Committees language={language} committees={committees} />
      <Officials language={language} currentMembers={members} />
    </main>
  )
}
