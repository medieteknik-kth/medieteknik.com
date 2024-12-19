import { useTranslation } from '@/app/i18n'
import type { LanguageCode } from '@/models/Language'
import type { Metadata } from 'next'
import MediaSlug from './slug'

interface Params {
  slug: string
  language: LanguageCode
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
    title: `${capitalizedValue} - ${capitalizedSlug}`,
    keywords: t('keywords'),
    description: t('description'),
    alternates: {
      canonical: `https://www.medieteknik.com/${language}/chapter/media/${slug}`,
      languages: {
        sv: `https://www.medieteknik.com/sv/chapter/media/${slug}`,
        en: `https://www.medieteknik.com/en/chapter/media/${slug}`,
        'x-default': `https://www.medieteknik.com/chapter/media/${slug}`,
      },
    },
  }
}

export default MediaSlug
