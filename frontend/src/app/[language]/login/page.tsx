import { useTranslation } from '@/app/i18n'
import { Metadata, ResolvingMetadata } from 'next'
import Login from './login'

interface Params {
  language: string
}

export async function generateMetadata(props: { params: Promise<Params> }, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const { t } = await useTranslation(params.language, 'login')
  const value = t('login')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
  }
}

export default Login
