import { Button } from '@/components/ui/button'
import { EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React, { ForwardRefExoticComponent, SVGProps, type JSX } from 'react'

export interface SectionDescriptionProps {
  title: string
  description: string
  links: {
    href: string
    text: string
    icon: string
  }[]
}

/**
 * @name SectionDescription
 * @description A section with a title, description, and links
 *
 * @param {SectionDescriptionProps} props - The props
 * @param {string} props.title - The title of the section
 * @param {string} props.description - The description of the section
 * @param {object[]} props.links - The links of the section
 * @returns {JSX.Element} The section description
 */
export function SectionDescription({
  title,
  description,
  links,
}: SectionDescriptionProps): JSX.Element {
  const getIcon = (
    icon: string
  ): ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, 'ref'>> => {
    switch (icon) {
      case 'mail':
        return EnvelopeIcon
      case 'web':
        return GlobeAltIcon
      default:
        return EnvelopeIcon
    }
  }

  return (
    <section
      id='section'
      className='w-full px-4 md:px-0 md:w-1/3 md:min-w-[600px] pt-4 h-fit'
    >
      <h2 className='text-md xxs:text-lg xs:text-2xl md:text-3xl uppercase tracking-wider border-b-2 border-yellow-400 pb-2'>
        {title}
      </h2>
      <div className='h-fit flex flex-col md:justify-between pt-4'>
        <p>{description}</p>
        <div
          className={`w-full mt-4 md:mt-0 flex flex-col md:flex-row items-center ${
            links.length > 1 ? 'justify-around' : 'justify-center'
          }`}
        >
          {links.map((link, index) => (
            <div key={index} className='w-full pb-4 flex justify-start'>
              <Button asChild variant='link' className='-ml-4 xs:text-md'>
                <Link
                  href={link.href}
                  target='_blank'
                  {...(!link.href.startsWith('mailto') && {
                    rel: 'noreferrer',
                  })}
                  className='text-sky-800 dark:text-sky-400 underline underline-offset-2'
                  title={
                    link.href.startsWith('mailto')
                      ? 'Mail: ' + link.text
                      : 'Go to: ' + link.text
                  }
                  aria-label={
                    link.href.startsWith('mailto')
                      ? 'Mail: ' + link.text
                      : 'Go to: ' + link.text
                  }
                >
                  {link.icon &&
                    React.createElement(getIcon(link.icon), {
                      className: 'w-6 h-6 mr-2 text-black dark:text-white',
                    })}
                  {link.text}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
