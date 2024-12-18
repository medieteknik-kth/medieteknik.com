'use client'

import { useToast } from '@/components/ui/use-toast'
import { LinkIcon } from '@heroicons/react/24/outline'
import { CSSProperties } from 'react'

interface Props {
  title: string
  id?: string
  style: CSSProperties
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export default function StaticHeading({
  title,
  id = title.toLowerCase().replace(' ', '-'),
  style,
  headingLevel = 'h2',
}: Props) {
  const { toast } = useToast()
  let headingElement
  switch (headingLevel) {
    case 'h1':
      headingElement = (
        <h1 id={id} style={style}>
          {title}
        </h1>
      )
      break
    case 'h2':
      headingElement = (
        <h2 id={id} style={style}>
          {title}
        </h2>
      )
      break
    case 'h3':
      headingElement = (
        <h3 id={id} style={style}>
          {title}
        </h3>
      )
      break
    case 'h4':
      headingElement = (
        <h4 id={id} style={style}>
          {title}
        </h4>
      )
      break
    case 'h5':
      headingElement = (
        <h5 id={id} style={style}>
          {title}
        </h5>
      )
      break
    case 'h6':
      headingElement = (
        <h6 id={id} style={style}>
          {title}
        </h6>
      )
      break
  }

  return (
    <div className='relative flex items-center h-fit'>
      <button
        className='absolute hidden md:inline-block h-8 w-auto aspect-square opacity-35 hover:opacity-100 transition-opacity -left-9 p-1 select-none'
        onClick={() => {
          const link = window.location.href.split('#')[0]
          navigator.clipboard.writeText(link + '#' + id)
          toast({
            title: 'Copied to clipboard',
            description: `${link + '#' + id}`,
            duration: 2500,
          })
        }}
        aria-label='Copy link'
        title='Copy link'
      >
        <LinkIcon className='h-full w-auto aspect-square' />
      </button>
      {headingElement}
    </div>
  )
}
