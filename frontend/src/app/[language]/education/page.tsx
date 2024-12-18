import { useTranslation } from '@/app/i18n'
import { Metadata } from 'next'
import Education from './education'
import { LanguageCode } from '@/models/Language'

interface Params {
  language: LanguageCode
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const { t } = await useTranslation(params.language, 'education')
  const value = t('title')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
    keywords: t('keywords'),
    description: t('description'),
    alternates: {
      canonical: `https://www.medieteknik.com/${params.language}/education`,
      languages: {
        sv: 'https://www.medieteknik.com/sv/education',
        en: 'https://www.medieteknik.com/en/education',
        'x-default': 'https://www.medieteknik.com/education',
      },
    },
  }
}

export default Education
