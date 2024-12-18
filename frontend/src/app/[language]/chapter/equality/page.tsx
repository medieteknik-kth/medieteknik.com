import Equality from '@/app/[language]/chapter/equality/equality'
import { useTranslation } from '@/app/i18n'
import { LanguageCode } from '@/models/Language'
import { Metadata } from 'next'

interface Params {
  language: LanguageCode
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const { t } = await useTranslation(params.language, 'equality/equality')
  const value = t('title')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
    keywords: t('keywords'),
    description: t('dei.description'),
    alternates: {
      canonical: `https://www.medieteknik.com/${params.language}/chapter/equality`,
      languages: {
        sv: 'https://www.medieteknik.com/sv/chapter/equality',
        en: 'https://www.medieteknik.com/en/chapter/equality',
        'x-default': 'https://www.medieteknik.com/chapter/equality',
      },
    },
  }
}

export default Equality
