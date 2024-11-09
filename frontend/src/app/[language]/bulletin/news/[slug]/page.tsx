import { GetNewsData } from '@/api/items'
import NewsSlug from '@/app/[language]/bulletin/news/[slug]/slug'
import { useTranslation } from '@/app/i18n'
import { Metadata } from 'next'

interface Params {
  language: string
  slug: string
}

export const dynamicParams = true

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const data = await GetNewsData(params.language, params.slug)

  if (!data) {
    const { t } = await useTranslation(params.language, 'bulletin')
    const value = t('title')

    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
    return {
      title: capitalizedValue,
    }
  }

  let title = data.translations[0].title
  if (title.length > 60) {
    title = title.substring(0, 60) + '...'
  }

  return {
    title: title,
  }
}

export default NewsSlug
