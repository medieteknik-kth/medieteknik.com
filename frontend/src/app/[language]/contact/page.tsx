import { useTranslation } from '@/app/i18n'
import { Button } from '@/components/ui/button'
import { EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface SectionDescriptionProps {
  title: string
  description: string
  links: {
    href: string
    text: string
    icon: string
  }[]
}

function SectionDescription({
  title,
  description,
  links,
}: {
  title: string
  description: string
  links: {
    href: string
    text: string
    icon:
      | string
      | React.ForwardRefExoticComponent<
          Omit<React.SVGProps<SVGSVGElement>, 'ref'>
        >
  }[]
}) {
  links.forEach((link) => {
    switch (link.icon) {
      case 'mail':
        link.icon = EnvelopeIcon
        break
      case 'web':
        link.icon = GlobeAltIcon
        break
      default:
        link.icon = EnvelopeIcon
    }
  })

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
                  <link.icon className='w-6 h-6 mr-2 text-black dark:text-white' />
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

export default async function Contact({
  params: { language },
}: {
  params: { language: string }
}) {
  const { t } = await useTranslation(language, 'contact')
  const contactData: SectionDescriptionProps[] = t('sections', {
    returnObjects: true,
  })
  return (
    <main>
      <div className='h-24 bg-black' />
      <div className='h-[350px] bg-[#111] flex flex-col items-center justify-center border-b-2 border-yellow-400'>
        <h1 className='text-5xl xs:text-7xl uppercase font-bold text-yellow-400'>
          {t('title')}
        </h1>
      </div>

      <div className='w-full flex items-center flex-col py-10 text-black bg-white dark:bg-[#232323] dark:text-white'>
        {contactData.map((section, index) => (
          <SectionDescription
            key={index}
            title={section.title}
            description={section.description}
            links={section.links}
          />
        ))}
      </div>
    </main>
  )
}
