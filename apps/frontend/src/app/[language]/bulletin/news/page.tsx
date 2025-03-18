import NewsPage from '@/app/[language]/bulletin/news/news'
import { useTranslation } from '@/app/i18n'
import type { LanguageCode } from '@/models/Language'

interface Params {
  language: LanguageCode
}

export async function generateMetadata(props: {
  params: Promise<Params>
}) {
  const params = await props.params
  const { t } = await useTranslation(params.language, 'bulletin')
  const value = t('title')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
  }
}

export default NewsPage
