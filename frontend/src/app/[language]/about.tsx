import { useTranslation } from '@/app/i18n'
import InfographicCard from '@/components/cards/Infographic'
import type { LanguageCode } from '@/models/Language'

import type { JSX } from 'react'

interface CardElement {
  title: string
  description: string
  icon: string
  href: string
  linkText: string
  ctaText: string
}

interface Props {
  language: LanguageCode
}

/**
 * @name About
 * @description The about section of the home page
 *
 * @param {object} props - The props to pass to the component
 * @param {string} props.language - The language code
 * @returns {Promise<JSX.Element>} The about section
 */
export default async function About({ language }: Props): Promise<JSX.Element> {
  const { t } = await useTranslation(language, 'index')

  const cards: CardElement[] = [
    {
      title: t('chapter.title'),
      description: t('chapter.description'),
      icon: 'https://storage.googleapis.com/medieteknik-static/committees/styrelsen.svg',
      href: `/${language}/chapter`,
      linkText: t('chapter.link_text'),
      ctaText: t('chapter.cta_text'),
    },
    {
      title: t('new_students.title'),
      description: t('new_students.description'),
      icon: 'https://storage.googleapis.com/medieteknik-static/committees/mtgn.svg',
      href: `/${language}/education`,
      linkText: t('new_students.link_text'),
      ctaText: t('new_students.cta_text'),
    },
    {
      title: 'International Students',
      description:
        'Are you an international student? Click above to learn more about META. The joint coordination between Computer Science and Media Technology programmes at KTH.',
      icon: 'https://storage.googleapis.com/medieteknik-static/committees/internationals.svg',
      href: 'https://metastudent.se/',
      linkText: t('international_link_text'),
      ctaText: 'Learn more about META',
    },
  ]

  return (
    <section className='w-full py-12 md:py-24 bg-gradient-to-b from-background to-muted/50'>
      <div className='container px-4 md:px-6'>
        <div className='space-y-2 flex flex-col items-center justify-center text-center mb-12'>
          <h3 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl'>
            {t('about')}
          </h3>
          <p className='max-w-[700px] text-muted-foreground md:text-xl'>
            {t('about_description')}
          </p>
        </div>

        <ul className='grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8'>
          {cards.map((card) => (
            <li key={card.title}>
              <InfographicCard
                card={{
                  title: card.title,
                  description: card.description,
                  icon: card.icon,
                  href: card.href,
                  linkText: card.linkText,
                  ctaText: card.ctaText,
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
