import Positions from '@/app/[language]/chapter/positions/positions'
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
  const { t } = await useTranslation(params.language, 'positions')
  const value = t('title')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
    keywords: t('keywords'),
    description: t('description'),
    alternates: {
      canonical: `https://www.medieteknik.com/${params.language}/chapter/positions`,
      languages: {
        sv: 'https://www.medieteknik.com/sv/chapter/positions',
        en: 'https://www.medieteknik.com/en/chapter/positions',
        'x-default': 'https://www.medieteknik.com/chapter/positions',
      },
    },
  }
}

export default Positions
