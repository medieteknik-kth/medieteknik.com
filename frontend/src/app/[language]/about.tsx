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
    },
    {
      title: t('new_students.title'),
      description: t('new_students.description'),
      icon: 'https://storage.googleapis.com/medieteknik-static/committees/mtgn.svg',
      href: `/${language}/education`,
      linkText: t('new_students.link_text'),
    },
    {
      title: 'International Students',
      description:
        'Are you an international student? Click above to learn more about META. The joint coordination between Computer Science and Media Technology programmes at KTH.',
      icon: 'https://storage.googleapis.com/medieteknik-static/committees/internationals.svg',
      href: 'https://metastudent.se/',
      linkText: t('international_link_text'),
    },
  ]

  return (
    <section className='w-full h-fit relative bg-white dark:bg-[#111] px-4 lg:px-20 2xl:px-56 py-20 border-t-2 flex flex-col gap-20 border-black/75 dark:border-white/75'>
      <h3 className='text-2xl xs:text-5xl font-bold w-full lg:w-fit py-2 lg:py-0 tracking-wider text-center lg:text-start'>
        {t('about')}
      </h3>

      <ul className='grid grid-cols-1 grid-rows-3 xl:grid-rows-1 xl:grid-cols-3 gap-4'>
        {cards.map((card) => (
          <li key={card.title}>
            <InfographicCard
              card={{
                title: card.title,
                description: card.description,
                icon: card.icon,
                href: card.href,
                linkText: card.linkText,
              }}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
