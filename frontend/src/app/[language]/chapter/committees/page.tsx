import { useTranslation } from '@/app/i18n'
import { Metadata } from 'next'
import CommitteeList from './committees'

interface Params {
  language: string
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const { t } = await useTranslation(params.language, 'committee')
  const value = t('title')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
  }
}
export default CommitteeList
