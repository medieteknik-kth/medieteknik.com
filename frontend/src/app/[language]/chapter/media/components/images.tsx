import { Button } from '@/components/ui/button'
import { Media } from '@/models/Items'
import Image from 'next/image'
import Link from 'next/link'
import { JSX } from 'react'

interface Props {
  image: Media
}

/**
 * @name ImageDisplay
 * @description A component displaying an image
 *
 * @param {Props} props
 * @param {Media} props.image - The image to display
 *
 * @returns {Promise<JSX.Element>} The image display component
 * @throws {TypeError} If the media is not an image
 */
export default async function ImageDisplay({
  image,
}: Props): Promise<JSX.Element> {
  if (image.media_type !== 'image') {
    throw new TypeError('Media is not an image')
  }

  return (
    <Button asChild variant={'ghost'}>
      <Link
        href={image.media_url}
        target='_blank'
        className='w-72 h-auto aspect-video relative rounded-lg flex flex-col hover:scale-105 transition-transform !p-0'
      >
        <Image
          src={image.media_url}
          alt={image.translations[0].title}
          width={288}
          height={288}
          priority
          loading='eager'
          className='w-full h-auto aspect-video object-cover rounded-lg'
        />
        <div className='w-full h-fit flex flex-col px-1 pb-1'>
          <p className='text-lg font-semibold mt-1 max-w-60 truncate'>
            {image.translations[0].title}
          </p>
          <p className='text-neutral-600 dark:text-neutral-300 text-sm max-w-60 truncate'>
            {image.translations[0].description}
          </p>
        </div>
      </Link>
    </Button>
  )
}
