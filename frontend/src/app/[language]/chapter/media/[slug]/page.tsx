import { useTranslation } from '@/app/i18n'
import { Metadata } from 'next'
import MediaSlug from './slug'

interface Params {
  slug: string
  language: string
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { language, slug } = await props.params
  const { t } = await useTranslation(language, 'media')
  const value = t('title')
  const slugTitle = decodeURI(slug)

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  const capitalizedSlug = slugTitle.charAt(0).toUpperCase() + slugTitle.slice(1)
  return {
    title: capitalizedValue + ' - ' + capitalizedSlug,
  }
}

export default MediaSlug
