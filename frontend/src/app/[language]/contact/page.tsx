import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { useTranslation } from '@/app/i18n'
import { EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

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
    <section id='section' className='w-1/3 h-[280px] bg-white'>
      <h2 className='text-3xl uppercase tracking-wider border-b-2 border-yellow-400 pb-2'>
        {title}
      </h2>
      <div className='h-2/3 flex flex-col justify-between pt-4'>
        <p>{description}</p>
        <div
          className={`w-full flex items-center ${
            links.length > 1 ? 'justify-around' : 'justify-center'
          }`}
        >
          {links.map((link, index) => (
            <div key={index} className='flex items-center'>
              <div className='w-12 h-12 grid place-items-center border-black border-2 rounded-full'>
                <link.icon className='w-6 h-6' />
              </div>

              <a
                href={link.href}
                {...(!link.href.startsWith('mailto') && {
                  target: '_blank',
                  rel: 'noreferrer',
                })}
                className='ml-4 text-blue-500 underline underline-offset-2'
              >
                {link.text}
              </a>
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
      <Header params={{ language }} />
      <div className='h-[720px] bg-[#111] flex flex-col items-center justify-center'>
        <h1 className='text-7xl uppercase font-bold text-yellow-400'>
          {t('title')}
        </h1>
      </div>

      <div className='w-full flex items-center flex-col py-20'>
        {contactData.map((section, index) => (
          <SectionDescription
            key={index}
            title={section.title}
            description={section.description}
            links={section.links}
          />
        ))}
      </div>

      <Footer params={{ language }} />
    </main>
  )
}
