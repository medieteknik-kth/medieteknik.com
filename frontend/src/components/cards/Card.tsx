import { StaticImageData } from 'next/image'
import { ChevronDoubleRightIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

/**
 * Card component
 *
 * @param {string} title - The title of the card
 * @param {string} description - The description of the card
 * @param {StaticImageData} image - The image of the card
 * @param {string} href - The href of the card
 */
interface CardProps {
  title: string
  description: string
  image: StaticImageData | { src: string }
  href: string
}

export default function Card({ title, description, image, href }: CardProps) {
  return (
    <div className='w-full h-full'>
      <div className='w-full h-full absolute -z-10'>
        <div className='w-full h-full absolute bg-black/50 z-10 rounded-t-2xl' />
        {typeof image === 'object' ? (
          <Image
            src={image.src}
            alt='placeholder'
            width={400}
            height={600}
            className='w-auto h-full object-cover'
          />
        ) : (
          <Image
            src={(image as StaticImageData).src}
            alt='placeholder'
            width={1000}
            height={1000}
            className='w-full h-full object-cover rounded-t-2xl ml-auto mr-auto'
          ></Image>
        )}
      </div>
      <div className='w-full h-full relative flex flex-col justify-between py-10'>
        <div className='w-full h-40 flex flex-col justify-between px-20 '>
          <h3 className='w-full text-3xl relative uppercase tracking-widest font-semibold text-center'>
            {title}
          </h3>
          <p className='text-lg tracking-wider text-center mt-8'>
            {description.split(' ').slice(0, 20).join(' ')}{' '}
          </p>
        </div>
        <div className='w-full h-24 absolute bottom-0 left-0 border-t-2 border-yellow-400 bg-[#111]'>
          <Link
            href={href}
            className='h-full flex justify-between items-center px-10'
          >
            <p className='text-xl uppercase'>Go To Page</p>
            <ChevronDoubleRightIcon className='w-8 h-8 text-white' />
          </Link>
        </div>
      </div>
    </div>
  )
}
