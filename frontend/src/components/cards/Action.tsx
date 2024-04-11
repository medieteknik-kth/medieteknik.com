import { StaticImageData } from 'next/image'
import './box.css'
import Link from 'next/link'
import Image from 'next/image'

export default function Action({
  title,
  image,
  href,
}: {
  title: string
  image: StaticImageData
  href: [string, boolean]
}) {
  return (
    <div className='w-full relative'>
      <div className='w-full h-full absolute overflow-x-hidden overflow-y-hidden '>
        <div className='w-full h-full absolute bg-black/5 z-10' />
        <Image
          src={image.src}
          alt='placeholder'
          width={600}
          height={600}
          className='w-auto h-full absolute object-right object-cover'
        />
      </div>

      <div className='highlight w-full h-full relative z-20'>
        <Link
          href={href[0]}
          {...(href[1] && {
            target: '_blank',
            rel: 'noopener noreferrer',
          })}
          className='w-full h-16 bg-black/75 grid place-items-center absolute bottom-0 transition-all'
        >
          <h3 className='text-2xl text-white text-center uppercase tracking-wider font-bold'>
            {title}
          </h3>
        </Link>
      </div>
    </div>
  )
}
