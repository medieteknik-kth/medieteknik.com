import { GetCommitteePublic } from '@/api/committee'
import { GetMediaData } from '@/api/items'
import ImageDisplay from '@/app/[language]/chapter/media/components/images'
import Redirect from '@/app/[language]/chapter/media/components/redirect'
import VideoDisplay from '@/app/[language]/chapter/media/components/videos'
import { useTranslation } from '@/app/i18n'
import HeaderGap from '@/components/header/components/HeaderGap'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import type Committee from '@/models/Committee'
import { MediaPagination } from '@/models/Pagination'
import { API_BASE_URL } from '@/utility/Constants'
import {
  ChevronLeftIcon,
  PhotoIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { JSX } from 'react'

interface Params {
  language: string
  slug: string
}

interface Props {
  params: Promise<Params>
}

/**
 * @name generateStaticParams
 * @description Generates the static paths for the committee pages
 *
 * @returns {Promise<{ language: string; committee: string }[]>} The generated static paths
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-static-params | Next.js Static Generation}
 */
export async function generateStaticParams(): Promise<
  { language: string; slug: string }[]
> {
  try {
    const response = await fetch(
      API_BASE_URL + `/public/committees?language=sv`
    )

    if (response.ok) {
      const data = (await response.json()) as Committee[]

      return data.map((committee: Committee) => ({
        language: '[language]',
        slug: encodeURIComponent(committee.translations[0].title.toLowerCase()),
      }))
    }
  } catch (error) {
    console.error(error)
    return []
  }

  return []
}

/**
 * @name MediaSlug
 * @description The page for a specific committee
 *
 * @param {Props} props
 * @param {Promise<Params>} props.params - the dynamic parameters of the URL
 * @param {string} props.params.language - The language of the page
 * @param {string} props.params.slug - The slug of the committee
 *
 * @returns {Promise<JSX.Element>} The committee page
 */
export default async function MediaSlug(props: Props): Promise<JSX.Element> {
  const { language, slug } = await props.params
  const committee_data: Committee | null = await GetCommitteePublic(
    slug,
    language
  )
  const { t } = await useTranslation(language, 'media')

  if (!committee_data || Object.keys(committee_data).length === 0) {
    return <Redirect language={language} />
  }

  const album_data: MediaPagination | null = await GetMediaData(
    'sv',
    committee_data.committee_id
  )

  if (!album_data || Object.keys(album_data).length === 0) {
    return <Redirect language={language} />
  }

  const videos = album_data.items.filter((item) => item.media_type === 'video')
  const images = album_data.items.filter((item) => item.media_type === 'image')

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
          <BreadcrumbItem className='capitalize'>{slug}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className='px-10 py-4 border-b flex justify-between'>
        <div className='flex items-center gap-4'>
          <div className='rounded-full overflow-hidden bg-white'>
            <Avatar className='bg-white p-1'>
              <AvatarImage src={committee_data.logo_url} />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h1 className='text-3xl capitalize tracking-wide'>{slug}</h1>
            <p className='leading-tight tracking-wide text-neutral-600 dark:text-neutral-300'>
              {t('title')}
            </p>
          </div>
        </div>
        <div className='flex items-center'>
          <Button size={'icon'} variant={'secondary'}>
            <Link href={`/${language}/chapter/media`}>
              <ChevronLeftIcon className='w-6 h-6' />
            </Link>
          </Button>
        </div>
      </section>

      <section className='mx-10 pb-4 flex flex-col gap-2 mt-2'>
        {videos.length > 0 && (
          <>
            <div className='flex items-center gap-2 mt-1'>
              <VideoCameraIcon className='w-6 h-6' />
              <h3 className='text-lg font-semibold'>{t('videos')}</h3>
            </div>
            <ul className='h-[160px] flex flex-wrap gap-4 text-white'>
              {videos
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
                .map((video, index) => (
                  <li key={index}>
                    <VideoDisplay language={language} video={video} />
                  </li>
                ))}
            </ul>
          </>
        )}
        {images.length > 0 && (
          <>
            <div className='flex items-center gap-2 mt-1'>
              <PhotoIcon className='w-6 h-6' />
              <h3 className='text-lg font-semibold'>{t('images')}</h3>
            </div>
            <ul className='flex flex-wrap gap-4 text-white'>
              {images
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
                .map((image, index) => (
                  <li
                    key={index}
                    className='w-72 h-auto aspect-square border rounded-md transition-transform hover:scale-105 relative'
                  >
                    <ImageDisplay image={image} />
                  </li>
                ))}
            </ul>
          </>
        )}
      </section>
    </main>
  )
}
