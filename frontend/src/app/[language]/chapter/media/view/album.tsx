import { useTranslation } from '@/app/i18n'
import { Button } from '@/components/ui/button'
import type { LanguageCode } from '@/models/Language'
import type { AlbumPagination } from '@/models/Pagination'
import Image from 'next/image'
import Link from 'next/link'
import FallbackImage from 'public/images/logo.webp'
import type { JSX } from 'react'

interface Props {
  language: LanguageCode
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

  if (!albums.items) {
    return <></>
  }

  return (
    <section className='px-2 sm:px-5 md:px-10 py-2'>
      <h2 className='text-2xl font-bold capitalize'>{t('album')}</h2>
      <ul className='flex flex-wrap gap-4 py-2'>
        {albums.items
          .sort(
            (a, b) =>
              new Date(a.updated_at).getTime() -
              new Date(b.updated_at).getTime()
          )
          .map((album) => (
            <li key={album.album_id}>
              <Button variant={'ghost'} asChild>
                <Link
                  href={`/${language}/chapter/media/album/${album.album_id}`}
                  className='w-52 sm:w-96 aspect-video h-fit relative hover:scale-105 transition-transform overflow-hidden'
                >
                  <Image
                    src={album.preview_media?.media_url || FallbackImage}
                    alt={album.translations[0].title}
                    width={288}
                    height={288}
                    className='w-full h-auto aspect-video rounded-md object-cover absolute left-0 top-0'
                  />

                  <div className='w-full h-full absolute bg-black/35 top-0 left-0 rounded-md' />
                  <div className='z-20 absolute left-2 bottom-2 truncate max-w-80'>
                    <h3 className='text-lg tracking-wider font-semibold text-white'>
                      {album.translations[0].title}
                    </h3>
                    <p className='text-neutral-200 tracking-wide'>
                      <span>
                        {album.total_images} {t('images')}
                      </span>{' '}
                      |{' '}
                      <span>
                        {album.total_videos} {t('videos')}
                      </span>
                    </p>
                  </div>
                </Link>
              </Button>
            </li>
          ))}
      </ul>
    </section>
  )
}
