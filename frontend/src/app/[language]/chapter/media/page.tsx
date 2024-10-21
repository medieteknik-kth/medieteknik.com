import { Metadata, ResolvingMetadata } from 'next'
import Media from './media'
import { useTranslation } from '@/app/i18n'

interface Params {
  language: string
}

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { t } = await useTranslation(params.language, 'media')
  const value = t('title')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
  }
}

export default Media