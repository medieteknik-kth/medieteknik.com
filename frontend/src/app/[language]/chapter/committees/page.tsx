import CommitteeList from './committees'
import { Metadata, ResolvingMetadata } from 'next'
import { useTranslation } from '@/app/i18n'

interface Params {
  language: string
}

export async function generateMetadata(props: { params: Promise<Params> }, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const { t } = await useTranslation(params.language, 'committee')
  const value = t('title')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
  }
}
export default CommitteeList
