import { useTranslation } from '@/app/i18n'
import { AlbumPagination } from '@/models/Pagination'
import Image from 'next/image'
import Link from 'next/link'
import FallbackImage from 'public/images/logo.webp'
import { JSX } from 'react'

interface Props {
  language: string
  albums: AlbumPagination | null
}

/**
 * @name Album
 * @description A component displaying a list of albums
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 * @param {AlbumPagination | null} props.albums - The albums or null
 *
 * @returns {Promise<JSX.Element>} The album component
 */
export default async function Album({
  language,
  albums,
}: Props): Promise<JSX.Element> {
  const { t } = await useTranslation(language, 'media')

  if (!albums || albums.total_items === 0) {
    return <></>
  }

  return (
    <section className='px-10 py-2'>
      <h2 className='text-2xl font-bold capitalize'>{t('album')}</h2>
      <ul className='flex flex-wrap gap-4 py-2'>
        {albums.items
          .sort(
            (a, b) =>
              new Date(a.updated_at).getTime() -
              new Date(b.updated_at).getTime()
          )
          .map((album) => (
            <li
              key={album.album_id}
              className='group w-72 cursor-pointer relative hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-500 rounded-md'
            >
              <Link href={`/${language}/chapter/media/album/${album.album_id}`}>
                <div className='group rounded-md group-hover:scale-105 transition-transform duration-500'>
                  {album.preview_media ? (
                    <Image
                      src={album.preview_media.media_url}
                      alt={album.translations[0].title}
                      width={288}
                      height={288}
                      className='w-72 h-auto aspect-video rounded-md object-cover'
                    />
                  ) : (
                    <Image
                      src={FallbackImage}
                      alt={album.translations[0].title}
                      width={288}
                      height={288}
                      className='w-72 h-auto aspect-video p-8'
                    />
                  )}
                </div>
                <div className='group px-1 py-2'>
                  <h3 className='text-lg tracking-wide leading-tight font-semibold'>
                    {album.translations[0].title}
                  </h3>
                  <p className='text-sm text-neutral-600 dark:text-neutral-300 leading-tight'>
                    {album.translations[0].description}
                  </p>
                  <div className='flex gap-4 my-1 text-sm px-1'>
                    <span>
                      {album.total_images} {t('images')}
                    </span>
                    <span>
                      {album.total_videos} {t('videos')}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </section>
  )
}
