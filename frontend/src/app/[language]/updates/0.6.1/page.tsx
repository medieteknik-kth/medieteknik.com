import Version061 from '@/app/[language]/updates/0.6.1/061'
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
  const { t } = await useTranslation(language, 'updates/versions/0.6.1')

  return {
    title: t('title'),
    description: t('overview_1'),
    keywords: t('keywords'),
    alternates: {
      canonical: `https://www.medieteknik.com/${language}/updates/0.6.1`,
      languages: {
        sv: 'https://www.medieteknik.com/sv/updates/0.6.1',
        en: 'https://www.medieteknik.com/en/updates/0.6.1',
        'x-default': 'https://www.medieteknik.com/updates/0.6.1',
      },
    },
  }
}

export default Version061
