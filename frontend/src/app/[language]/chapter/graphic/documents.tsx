import { useTranslation } from '@/app/i18n'
import { Button } from '@/components/ui/button'
import { LanguageCode } from '@/models/Language'
import { LANGUAGES } from '@/utility/Constants'
import Image from 'next/image'
import Link from 'next/link'

import type { JSX } from 'react'

/**
 * @interface Props
 * @property {string} language - The currently selected language
 */
interface Props {
  language: LanguageCode
}

/**
 * @name Documents
 * @description The relevant documents for the graphical identity
 *
 * @param {Props} props - The component properties
 * @param {string} props.language - The currently selected language
 * @returns {Promise<JSX.Element>} The relevant documents for the graphical identity
 */
export default async function Documents({
  language,
}: Props): Promise<JSX.Element> {
  const { t } = await useTranslation(language, 'graphic')

  const documents = [
    {
      name: t('documents.manual'),
      url: 'https://storage.googleapis.com/medieteknik-static/documents/Grafisk%20manual%20(Uppdaterad%202018-09-17).pdf',
      previewImage:
        'https://storage.googleapis.com/medieteknik-static/static/graphical_identity/graphics.webp',
      lastUpdated: '2018-09-17',
      supportedLanguages: ['sv'],
    },
  ]

  return (
    <section id='documents' className='px-12 mb-8'>
      <h2 className='py-4 font-bold text-3xl uppercase tracking-wide'>
        {t('documents')}
      </h2>
      <ul className='flex gap-4'>
        {documents.map((document) => (
          <li key={document.name} className='flex flex-col gap-2'>
            <Image
              src={document.previewImage}
              alt='preview image'
              width={1080}
              height={1440}
              className='w-96'
            />
            <Button asChild>
              <Link href={document.url} target='_blank'>
                {t('documents.download')} {document.name}
              </Link>
            </Button>
            <p className='tracking-wide text-lg flex items-center gap-2'>
              {document.supportedLanguages.map((lang) => (
                <span key={lang} className='w-6 h-6'>
                  {LANGUAGES[lang as LanguageCode].flag_icon}
                </span>
              ))}
              {document.name}
            </p>
            <p className='leading-3 text-neutral-600 dark:text-neutral-300'>
              {t('documents.last_update')} {document.lastUpdated}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
