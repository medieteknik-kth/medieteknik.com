import React from 'react'
import Image, { StaticImageData } from 'next/image'

export function Head({
  title,
  description,
  image,
}: {
  title: string
  description?: string
  image?: StaticImageData
}) {
  return (
    <div className='w-full h-fit bg-[#111] dark:bg-inherit flex items-center border-b-2 border-yellow-400'>
      <div
        className={`w-full ${
          image ? 'xl:w-1/2' : 'w-full justify-center'
        } h-fit flex items-center py-20`}
      >
        <div
          className={`h-fit flex flex-col justify-center z-10 px-0 lg:px-20 items-center text-center ${
            image ? 'xl:items-start' : 'xl:items-center'
          } ${image ? 'xl:text-start' : 'xl:text-center'}`}
        >
          <h1
            className={`w-fit text-3xl lg:text-7xl uppercase font-bold text-yellow-400 ${
              image ? 'mb-8' : 'mb-0'
            } tracking-wider`}
          >
            {title}
          </h1>
          <p className='w-full h-fit text-white text-xl tracking-tight uppercase'>
            {description}
          </p>
        </div>
      </div>

      {image && (
        <div className='w-1/2 h-[350px] hidden xl:block overflow-x-hidden overflow-y-hidden relative'>
          <div className='w-full h-full bg-black/25 absolute z-10' />
          <Image
            src={image.src}
            alt='Test Background'
            width={2000}
            height={350}
            priority
            loading='eager'
            className='w-full h-auto object-cover absolute top-0 bottom-0 left-0 right-0 m-auto'
          />
        </div>
      )}
    </div>
  )
}

const defaultMetadata: {
  height: string
  background: string
  textColor: string
} = {
  height: '400px',
  background: '#fff',
  textColor: '#000',
}

export function Section({
  title,
  children,
  centeredChildren,
  metadata,
}: {
  title?: string
  children?: React.JSX.Element
  centeredChildren?: boolean
  metadata?: {
    height?: string
    background?: string
    textColor?: string
    marginTop?: string
  }
}) {
  if (!metadata || Object.keys(metadata).length === 0) {
    metadata = defaultMetadata
  }

  Object.keys(defaultMetadata).forEach((key) => {
    if (!metadata[key as keyof typeof metadata]) {
      metadata[key as keyof typeof metadata] =
        defaultMetadata[key as keyof typeof defaultMetadata]
    }
  })

  return (
    <section
      className={`w-full h-fit border-b-2 border-neutral-200 dark:border-neutral-700 bg-[${
        metadata.background
      }] dark:bg-[#111] mt-[${metadata.marginTop}] ${
        centeredChildren ? 'flex flex-col items-center' : ''
      }`}
      id={title?.toLowerCase().replace(' ', '-')}
    >
      {title && (
        <div className='w-full h-fit text-center grid place-items-center'>
          <h2
            className={`uppercase tracking-wider font-semibold text-3xl w-2/4 border-b-2 border-yellow-400 py-8 text-[${metadata.textColor}]`}
          >
            {title}
          </h2>
        </div>
      )}

      {children}
    </section>
  )
}
