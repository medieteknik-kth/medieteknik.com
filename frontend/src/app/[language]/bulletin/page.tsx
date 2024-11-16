import { useTranslation } from '@/app/i18n'
import { Metadata } from 'next'
import Bulletin from './bulletin'

interface Params {
  language: string
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const { t } = await useTranslation(params.language, 'bulletin')
  const value = t('title')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
    keywords: t('keywords'),
    description: t('description'),
    alternates: {
      canonical: `https://www.medieteknik.com/${params.language}/bulletin`,
      languages: {
        sv: 'https://www.medieteknik.com/sv/bulletin',
        en: 'https://www.medieteknik.com/en/bulletin',
        'x-default': 'https://www.medieteknik.com/bulletin',
      },
    },
  }
}

export default Bulletin
