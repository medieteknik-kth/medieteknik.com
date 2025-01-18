import Updates from '@/app/[language]/updates/updates'
import { useTranslation } from '@/app/i18n'
import type { LanguageCode } from '@/models/Language'
import type { Metadata } from 'next'

interface Params {
  language: LanguageCode
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { language } = await props.params
  const { t } = await useTranslation(language, 'updates/common')

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: {
      canonical: `https://www.medieteknik.com/${language}/updates`,
      languages: {
        sv: 'https://www.medieteknik.com/sv/updates',
        en: 'https://www.medieteknik.com/en/updates',
        'x-default': 'https://www.medieteknik.com/updates',
      },
    },
  }
}

export default Updates
