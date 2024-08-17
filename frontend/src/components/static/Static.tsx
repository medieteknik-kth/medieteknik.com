import React from 'react'
import Image, { StaticImageData } from 'next/image'

export function Head({
  title,
  description,
  image,
  children,
}: {
  title: string
  description?: string
  image?: StaticImageData
  children?: React.JSX.Element
}) {
  return (
    <div className='w-full h-fit bg-[#EEE] dark:bg-[#222] flex items-center border-b-2 border-yellow-400 relative'>
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
            className={`w-fit text-3xl lg:text-7xl uppercase font-bold text-black dark:text-yellow-400 ${
              image ? 'mb-8' : 'mb-0'
            } tracking-wider`}
          >
            {title}
          </h1>
          <p className='w-full h-fit text-xl tracking-tight uppercase'>
            {description}
          </p>
        </div>
      </div>

      {image && (
        <div className='grow h-[448px] hidden xl:block overflow-hidden relative '>
          <div className='w-full h-full bg-black/25 z-10 grid place-items-center absolute' />
          <Image
            src={image}
            alt='Test Background'
            fill
            sizes='(max-width: 1280px) 0vw, 50vw'
            priority
            loading='eager'
            quality={90}
            className='w-full h-auto object-cover object-center bg-center'
          />
        </div>
      )}

      {children}
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
      className={`w-full h-fit border-b-2 border-neutral-200 dark:border-neutral-700  dark:bg-[#111]  ${
        centeredChildren ? 'flex flex-col items-center' : ''
      }`}
      id={title?.toLowerCase().replace(' ', '-')}
      style={{
        backgroundColor: metadata.background,
        marginTop: metadata.marginTop,
        color: metadata.textColor,
      }}
    >
      {title && (
        <div className='w-full h-fit text-center grid place-items-center'>
          <h2
            className={`uppercase tracking-wider font-semibold text-3xl w-9/12 border-b-2 border-yellow-400 py-8`}
          >
            {title}
          </h2>
        </div>
      )}

      {children}
    </section>
  )
}
