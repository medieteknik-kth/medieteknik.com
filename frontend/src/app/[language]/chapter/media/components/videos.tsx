'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Media } from '@/models/Items'
import {
  isCookieCategoryAllowed,
  retrieveCookieSettings,
} from '@/utility/CookieManager'
import { VideoCameraIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { JSX, useState } from 'react'

interface Props {
  language: string
  video: Media
}

/**
 * @name VideoDisplay
 * @description A component displaying a video
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 * @param {Media} props.video - The video to display
 *
 * @returns {JSX.Element} The video display component
 * @throws {TypeError} If the media is not a video
 */
export default function VideoDisplay({ language, video }: Props): JSX.Element {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()
  const { t } = useTranslation(language, 'media')

  if (video.media_type !== 'video') {
    throw new TypeError('Media is not a video')
  }

  const youtube_url = (fullUrl: string) => {
    const url = new URL(fullUrl)
    return url.searchParams.get('v')
  }

  return (
    <>
      <Button
        className='relative w-72 h-[160px] border rounded-md transition-transform hover:scale-105 p-0'
        variant={'ghost'}
        onClick={() => {
          if (
            !isCookieCategoryAllowed(retrieveCookieSettings(), 'THIRD_PARTY')
          ) {
            toast({
              title: t('cookie_settings'),
              description: t('cookie_error'),
              duration: 5000,
            })
            return
          }

          setDialogOpen(true)
        }}
      >
        <Image
          src={`https:/i.ytimg.com/vi/${youtube_url(
            video.media_url
          )}/maxresdefault.jpg`}
          alt='thumbnail'
          width={288}
          height={162}
          className='absolute top-0 left-0 w-full h-auto object-fill bottom-0 my-auto rounded-md'
        />
        <div className='w-full h-full grid p-2 grid-cols-12 grid-rows-9'>
          <div className='w-fit h-full col-start-11 col-span-2 row-span-2 p-1.5 text-white bg-black/75 rounded-md z-10 place-self-end'>
            <VideoCameraIcon className='h-full aspect-square' />
          </div>
          <div className='w-full h-full text-start text-white row-start-8 row-span-2 col-span-12 p-2 bg-black/75 rounded-md text-sm z-10 place-self-center overflow-hidden'>
            <p>{video.translations[0].title}</p>
          </div>
        </div>
      </Button>

      {dialogOpen && (
        <div className='fixed left-0 top-0 w-screen h-screen z-50 grid place-items-center transition-all'>
          <div
            className='absolute left-0 top-0 h-full w-full bg-black/75'
            onClick={() => setDialogOpen(false)}
          />
          <Button
            className='absolute right-96 top-48'
            size={'icon'}
            onClick={(event) => {
              event.stopPropagation()
              setDialogOpen(false)
            }}
          >
            <XMarkIcon className='w-6 h-6' />
          </Button>
          {isCookieCategoryAllowed(retrieveCookieSettings(), 'THIRD_PARTY') && (
            <iframe
              width='1386'
              height='780'
              src={`https://www.youtube.com/embed/${youtube_url(
                video.media_url
              )}`}
              title='YouTube video player'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              referrerPolicy='strict-origin-when-cross-origin'
              className='z-40 w-full h-auto aspect-video xs:w-[90vw] xs:h-[50vw] sm:w-[80vw] sm:h-[45vw] md:w-[70vw] md:h-[40vw] lg:w-[60vw] lg:h-[35vw] xl:w-[50vw] xl:h-[30vw] 2xl:w-[40vw] 2xl:h-[25vw]'
              allowFullScreen
            />
          )}
        </div>
      )}
    </>
  )
}
