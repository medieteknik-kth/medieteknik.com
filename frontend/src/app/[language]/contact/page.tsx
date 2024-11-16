import { useTranslation } from '@/app/i18n'
import { Metadata } from 'next'
import Contact from './contact'

interface Params {
  language: string
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const { t } = await useTranslation(params.language, 'contact')
  const value = t('title')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
    keywords: t('keywords'),
    description: t('description'),
    alternates: {
      canonical: `https://www.medieteknik.com/${params.language}/contact`,
      languages: {
        sv: 'https://www.medieteknik.com/sv/contact',
        en: 'https://www.medieteknik.com/en/contact',
        'x-default': 'https://www.medieteknik.com/contact',
      },
    },
  }
}

export default Contact
