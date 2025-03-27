import { getAllCommittees } from '@/api/committee'
import { getOfficials } from '@/api/student'
import { useTranslation } from '@/app/i18n'
import { HeadComponent } from '@/components/static/Static'
import type { LanguageCode } from '@/models/Language'
import Committees from './committees'
import Officials from './officials'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

export default async function Chapter(props: Props) {
  const { language } = await props.params
  const { data: committees } = await getAllCommittees(language)
  const currentYear = new Date().getFullYear()
  const semester = new Date().getMonth() < 6 ? 'VT' : 'HT'
  const { data: members } = await getOfficials(
    language,
    currentYear.toString(),
    semester
  )

  console.log(members)

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
