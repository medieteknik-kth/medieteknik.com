import NewsSlug from '@/app/[language]/bulletin/news/[slug]/slug'
import { useTranslation } from '@/app/i18n'
import { Metadata, ResolvingMetadata } from 'next'

interface Params {
  language: string
  committee: string
}

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { t } = await useTranslation(params.language, 'bulletin')
  const value = t('news')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
  }
}

export default NewsSlug
