import Positions from '@/app/[language]/chapter/positions/positions'
import { useTranslation } from '@/app/i18n'
import { Metadata, ResolvingMetadata } from 'next'


interface Params {
  language: string
}

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { t } = await useTranslation(params.language, 'positions')
  const value = t('title')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
  }
}

export default Positions
