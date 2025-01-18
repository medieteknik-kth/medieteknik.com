import { useTranslation } from '@/app/i18n'
import type { LanguageCode } from '@/models/Language'
import type { Metadata } from 'next'
import GraphicalIdentity from './graphic'

interface Params {
  language: LanguageCode
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const { t } = await useTranslation(params.language, 'graphic')
  const value = t('title')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
    keywords: t('keywords'),
    description: t('description'),
    alternates: {
      canonical: `https://www.medieteknik.com/${params.language}/chapter/graphic`,
      languages: {
        sv: 'https://www.medieteknik.com/sv/chapter/graphic',
        en: 'https://www.medieteknik.com/en/chapter/graphic',
        'x-default': 'https://www.medieteknik.com/chapter/graphic',
      },
    },
  }
}
export default GraphicalIdentity
