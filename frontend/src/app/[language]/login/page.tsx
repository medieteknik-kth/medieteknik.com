import { useTranslation } from '@/app/i18n'
import type { LanguageCode } from '@/models/Language'
import type { Metadata } from 'next'
import Login from './login'

interface Params {
  language: LanguageCode
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const { t } = await useTranslation(params.language, 'login')
  const value = t('login')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
    keywords: t('keywords'),
    description: t('description'),
    alternates: {
      canonical: `https://www.medieteknik.com/${params.language}/login`,
      languages: {
        sv: 'https://www.medieteknik.com/sv/login',
        en: 'https://www.medieteknik.com/en/login',
        'x-default': 'https://www.medieteknik.com/login',
      },
    },
  }
}

export default Login
