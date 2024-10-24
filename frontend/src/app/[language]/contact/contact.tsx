import { useTranslation } from '@/app/i18n'
import HeaderGap from '@/components/header/components/HeaderGap'
import { HeadComponent } from '@/components/static/Static'
import { SectionDescription, SectionDescriptionProps } from './utility/section'

import type { JSX } from 'react'

interface Params {
  language: string
}

interface Props {
  params: Promise<Params>
}

/**
 * @name Contact
 * @description The contact page
 *
 * @param {object} params - The dynamic route parameters
 * @param {string} params.language - The language code
 * @returns {Promise<JSX.Element>} The contact page
 */
export default async function Contact(props: Props): Promise<JSX.Element> {
  const { language } = await props.params
  const { t } = await useTranslation(language, 'contact')

  const contactData: SectionDescriptionProps[] = t('sections', {
    returnObjects: true,
  }) as SectionDescriptionProps[]

  return (
    <main>
      <HeaderGap />
      <HeadComponent title={t('title')} />

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
