import { getAlbumAndMedia } from '@/api/items/media'
import AlbumSlug from '@/app/[language]/chapter/media/album/[slug]/albumSlug'
import { useTranslation } from '@/app/i18n'
import { Metadata } from 'next'

interface Params {
  language: string
  slug: string
}

export const revalidate = 1_000_000

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { language, slug } = await props.params
  const { data: album, error } = await getAlbumAndMedia(language, slug)
  const { t } = await useTranslation(language, 'media')
  let value = ''

  if (error) {
    value = t('title')
  } else {
    value = t('title') + ' - ' + decodeURI(album.album.translations[0].title)
  }

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
    keywords: t('keywords'),
    description: album?.album.translations[0].description || t('description'),
    alternates: {
      canonical: `https://www.medieteknik.com/${language}/chapter/media/album/${slug}`,
      languages: {
        sv: `https://www.medieteknik.com/sv/chapter/media/album/${slug}`,
        en: `https://www.medieteknik.com/en/chapter/media/album/${slug}`,
        'x-default': `https://www.medieteknik.com/chapter/media/album/${slug}`,
      },
    },
  }
}

export default AlbumSlug
