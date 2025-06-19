import { useTranslation } from '@/app/i18n'
import type { LanguageCode } from '@/models/Language'
import type { Metadata } from 'next'
import Media from './media'

interface Params {
  language: LanguageCode
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { language } = await props.params
  const { t } = await useTranslation(language, 'media')
  const value = t('title')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
    keywords: t('keywords'),
    description: t('description'),
    alternates: {
      canonical: `https://www.medieteknik.com/${language}/chapter/media`,
      languages: {
        sv: 'https://www.medieteknik.com/sv/chapter/media',
        en: 'https://www.medieteknik.com/en/chapter/media',
        'x-default': 'https://www.medieteknik.com/chapter/media',
      },
    },
  }
}

export default Media
