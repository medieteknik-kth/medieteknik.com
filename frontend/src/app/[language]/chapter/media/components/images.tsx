import { Media } from '@/models/Items'
import { PhotoIcon } from '@heroicons/react/24/outline'
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
    <Link href={image.media_url} target='_blank'>
      <Image
        src={image.media_url}
        alt='thumbnail'
        width={356}
        height={356}
        priority
        loading='eager'
        className='absolute top-0 left-0 w-72 h-auto aspect-square object-cover bottom-0 my-auto rounded-md'
      />
      <div className='w-full h-full grid p-2 grid-cols-8 grid-rows-8'>
        <div className='w-full h-full col-start-8 p-1.5 bg-black/65 rounded-md z-10 place-self-center text-white'>
          <PhotoIcon />
        </div>
        <div className='w-full h-full row-start-8 col-span-8 p-2 bg-black/65 rounded-md text-sm z-10 place-self-center text-white'>
          <p>{image.translations[0].title}</p>
        </div>
      </div>
    </Link>
  )
}
