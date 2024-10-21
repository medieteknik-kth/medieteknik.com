import { useTranslation } from '@/app/i18n'
import { SectionDescription, SectionDescriptionProps } from './utility/section'
import { HeadComponent } from '@/components/static/Static'
import HeaderGap from '@/components/header/components/HeaderGap'

interface Props {
  params: {
    language: string
  }
}

/**
 * @name Contact
 * @description The contact page
 *
 * @param {object} params - The dynamic route parameters
 * @param {string} params.language - The language code
 * @returns {Promise<JSX.Element>} The contact page
 */
export default async function Contact({
  params: { language },
}: Props): Promise<JSX.Element> {
  const { t } = await useTranslation(language, 'contact')
  const contactData: SectionDescriptionProps[] = t('sections', {
    returnObjects: true,
  })
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
