import { getAlbumAndMedia } from '@/api/items/media'
import ImageDisplay from '@/app/[language]/chapter/media/components/images'
import Redirect from '@/app/[language]/chapter/media/components/redirect'
import VideoDisplay from '@/app/[language]/chapter/media/components/videos'
import { useTranslation } from '@/app/i18n'
import HeaderGap from '@/components/header/components/HeaderGap'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import type { LanguageCode } from '@/models/Language'
import {
  FolderIcon,
  PhotoIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import type { JSX } from 'react'

interface Params {
  language: LanguageCode
  slug: string
}

interface Props {
  params: Promise<Params>
}

/**
 * @name AlbumSlug
 * @description The page for a specific album
 *
 * @param {Props} props
 * @param {Promise<Params>} props.params - the dynamic parameters of the URL
 * @param {string} props.params.language - The language of the page
 * @param {string} props.params.slug - The slug of the album
 *
 * @returns {Promise<JSX.Element>} The album page
 */
export default async function AlbumSlug(props: Props): Promise<JSX.Element> {
  const { language, slug } = await props.params
  const { data: album, error } = await getAlbumAndMedia(language, slug, 60)
  const { t } = await useTranslation(language, 'media')

  if (error) {
    return <Redirect language={language} />
  }

  const videos = album.media.filter((item) => item.media_type === 'video')
  const images = album.media.filter((item) => item.media_type === 'image')

  return (
    <main>
      <HeaderGap />
      <Breadcrumb className='px-10 pt-4'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${language}`}>{t('home')}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${language}/chapter`}>{t('chapter')}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${language}/chapter/media`}>{t('title')}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{t('albums')}</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{slug}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='px-10 py-4 flex items-center gap-4 border-b shadow-xs shadow-black/25'>
        <FolderIcon className='w-8 h-8' />
        <div>
          <h1 className='text-2xl tracking-wide leading-tight'>
            {album.album.translations[0].title}
          </h1>
          <p className='leading-tight text-neutral-600 dark:text-neutral-300'>
            {album.album.translations[0].description}
          </p>
        </div>
      </section>

      {videos.length > 0 && (
        <section className='flex flex-col justify-center gap-2 my-0.5 px-10'>
          <div className='flex items-center gap-2 my-0.5'>
            <VideoCameraIcon className='w-6 h-6' />
            <h3 className='text-lg font-semibold'>{t('videos')}</h3>
          </div>
          <ul className='h-fit flex flex-wrap gap-4'>
            {videos
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((video) => (
                <li key={`${video.translations[0].title}_${video.media_url}`}>
                  <VideoDisplay language={language} video={video} />
                </li>
              ))}
          </ul>
        </section>
      )}

      {images.length > 0 && (
        <section className='flex flex-col justify-center gap-2 my-2 px-10'>
          <div className='flex items-center gap-2 my-0.5'>
            <PhotoIcon className='w-6 h-6' />
            <h3 className='text-lg font-semibold'>{t('images')}</h3>
          </div>
          <ul className='flex flex-wrap gap-4'>
            {images
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((image) => (
                <li
                  key={`${image.translations[0].title}_${image.media_url}`}
                  className=''
                >
                  <ImageDisplay image={image} />
                </li>
              ))}
          </ul>
        </section>
      )}
    </main>
  )
}
