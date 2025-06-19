import { useTranslation } from '@/app/i18n'
import type { LanguageCode } from '@/models/Language'
import type { Metadata } from 'next'
import Documents from './documents'

interface Params {
  language: LanguageCode
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const { t } = await useTranslation(params.language, 'document')
  const value = t('title')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
    keywords: t('keywords'),
    description: t('description'),
    alternates: {
      canonical: `https://www.medieteknik.com/${params.language}/chapter/documents`,
      languages: {
        sv: 'https://www.medieteknik.com/sv/chapter/documents',
        en: 'https://www.medieteknik.com/en/chapter/documents',
        'x-default': 'https://www.medieteknik.com/chapter/documents',
      },
    },
  }
}
export default Documents
