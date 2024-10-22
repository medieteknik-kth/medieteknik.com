import { Metadata, ResolvingMetadata } from 'next'
import Album from './album'
import { useTranslation } from '@/app/i18n'

interface Params {
  slug: string
  language: string
}

export async function generateMetadata(props: { params: Promise<Params> }, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const { t } = await useTranslation(params.language, 'media')
  const value = t('title')
  const slug = decodeURI(params.slug)

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1)
  return {
    title: capitalizedValue + ' - ' + capitalizedSlug,
  }
}

export default Album
