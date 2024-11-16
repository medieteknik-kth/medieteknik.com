import { useTranslation } from '@/app/i18n'
import { Metadata } from 'next'
import Chapter from './chapter'

interface Params {
  language: string
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const { t } = await useTranslation(params.language, 'chapter')
  const value = t('title')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
    keywords: t('keywords'),
    description: t('description'),
    alternates: {
      canonical: `https://www.medieteknik.com/${params.language}/chapter`,
      languages: {
        sv: 'https://www.medieteknik.com/sv/chapter',
        en: 'https://www.medieteknik.com/en/chapter',
        'x-default': 'https://www.medieteknik.com/chapter',
      },
    },
  }
}

export default Chapter
