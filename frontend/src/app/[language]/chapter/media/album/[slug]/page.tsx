import { GetAlbum } from '@/api/items'
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
  const album = await GetAlbum(language, slug)
  const { t } = await useTranslation(language, 'media')
  let value = ''

  if (!album) {
    value = t('title')
  } else {
    value = t('title') + ' - ' + decodeURI(album.album.translations[0].title)
  }

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: capitalizedValue,
  }
}

export default AlbumSlug
