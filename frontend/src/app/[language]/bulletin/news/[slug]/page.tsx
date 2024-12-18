import { getNewsData } from '@/api/items/news'
import NewsSlug from '@/app/[language]/bulletin/news/[slug]/slug'
import { useTranslation } from '@/app/i18n'
import { LanguageCode } from '@/models/Language'
import { Metadata } from 'next'

interface Params {
  language: LanguageCode
  slug: string
}

export const dynamicParams = true

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const { data, error } = await getNewsData(params.language, params.slug)

  if (error) {
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
    description: data.translations[0].short_description,
    keywords: `${data.translations[0].title}, news, ${
      data.author.author_type === 'COMMITTEE'
        ? data.author.translations[0].title
        : data.author.author_type === 'STUDENT'
        ? data.author.first_name + ' ' + (data.author.last_name || '')
        : ''
    }`,
    alternates: {
      canonical: `https://www.medieteknik.com/${params.language}/bulletin/news/${params.slug}`,
      languages: {
        sv: `https://www.medieteknik.com/sv/bulletin/news/${params.slug}`,
        en: `https://www.medieteknik.com/en/bulletin/news/${params.slug}`,
        'x-default': `https://www.medieteknik.com/bulletin/news/${params.slug}`,
      },
    },
    openGraph: {
      title: title,
      description: data.translations[0].short_description,
      locale: params.language === 'sv' ? 'sv_SE' : 'en_GB',
      siteName: 'Medieteknik - KTH',
      countryName: 'Sweden',
      url:
        'https://www.medieteknik.com/' +
        params.language +
        '/bulletin/news/' +
        params.slug,
      type: 'article',
      publishedTime: data.created_at,
      modifiedTime: data.last_updated || data.created_at,
      images: data.translations[0].main_image_url && {
        url: data.translations[0].main_image_url,
        type: 'image/' + data.translations[0].main_image_url.split('.').pop(),
        width: 700,
        height: 320,
        alt: data.translations[0].title,
      },
      authors:
        data.author.author_type === 'COMMITTEE'
          ? data.author.translations[0].title
          : data.author.author_type === 'STUDENT'
          ? data.author.first_name + ' ' + data.author.last_name
          : null,
    },
  }
}

export default NewsSlug
