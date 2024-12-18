import { useTranslation } from '@/app/i18n'
import { LanguageCode } from '@/models/Language'

import type { JSX } from 'react'

interface Props {
  language: LanguageCode
}

/**
 * @name Typography
 * @description The relevant fonts for the graphical identity
 *
 * @param {Props} props - The component properties
 * @param {string} props.language - The currently selected language
 * @returns {Promise<JSX.Element>} The relevant fonts for the graphical identity
 */
export default async function Typography({
  language,
}: Props): Promise<JSX.Element> {
  const { t } = await useTranslation(language, 'graphic')

  const fonts = [
    {
      id: 'figtree',
      name: 'Figtree',
      use: 'Main use across the website. Used in headings and body text.',
      weight: ['Regular', 'Bold'],
      style: ['Normal', 'Italic'],
      url: 'https://fonts.gstatic.com/s/figtree/v1/6ae84f6f-1b4d-4b6f-8f9d-3f7a4c4e1c9b.woff2',
    },
    {
      id: 'jetbrains_mono',
      name: 'JetBrains Mono',
      use: 'Main use in code snippets and code blocks. Used in body text.',
      weight: ['Regular'],
      style: ['Normal'],
      url: 'https://fonts.gstatic.com/s/jetbrainsmono/v1/6ae84f6f-1b4d-4b6f-8f9d-3f7a4c4e1c9b.woff2',
    },
    {
      id: 'helvetica',
      name: 'Helvetica',
      use: 'Main use in the chapters documents. Used in headings and body text.',
      weight: ['Regular', 'Light', 'Bold'],
      style: ['Normal', 'Oblique'],
      url: 'https://fonts.gstatic.com/s/helvetica/v1/1Ptxg8zYS_SKggPNyC0IT4ttDfCn5F1p6mZf.woff2',
    },
    {
      id: 'georgia',
      name: 'Georgia',
      use: 'Main use in body text and headings',
      weight: ['Regular', 'Bold'],
      style: ['Normal', 'Italic'],
      url: 'https://fonts.gstatic.com/s/georgia/v1/SLxGc1JGklf8WVUdFA.woff2',
    },
    {
      id: 'helvetica_neue',
      name: 'Helvetica Neue',
      use: 'Main use in logos for committees and organizations',
      weight: ['Light'],
      style: ['Normal'],
      url: 'https://fonts.gstatic.com/s/helveticaneue/v1/36b0c0f4-8b3e-4b8b-8e7e-4f4c3d9d0d4b.woff2',
    },
    {
      id: 'trebuchet_ms',
      name: 'Trebuchet MS',
      use: 'Main use in body text and captions',
      weight: ['Regular', 'Bold'],
      style: ['Normal', 'Italic'],
      url: 'https://fonts.gstatic.com/s/trebuchetms/v1/6ae84f6f-1b4d-4b6f-8f9d-3f7a4c4e1c9b.woff2',
    },
  ]

  return (
    <section id='typography' className='px-2 sm:px-5 md:px-12 mb-8'>
      <div className='py-4'>
        <h2 className='font-bold text-3xl uppercase tracking-wide'>
          {t('typography')}
        </h2>
      </div>

      <ul className='flex gap-4 flex-wrap justify-center sm:justify-start'>
        {fonts.map((font) => (
          <li
            key={font.name}
            className='w-[500px] flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-start gap-3 my-1 sm:my-0'
          >
            <div className='w-24 aspect-square bg-yellow-400 rounded-full grid place-items-center text-3xl text-black'>
              <p
                className='tracking-wider select-none'
                style={{
                  fontFamily: font.name + ", 'Helvetica', 'Arial', sans-serif",
                  fontWeight: font.weight[0],
                  fontStyle: font.style[0],
                }}
              >
                Aa
              </p>
            </div>
            <div>
              <h3 className='text-2xl tracking-wide'>{font.name}</h3>
              <p>
                {font.weight.join(', ')} {font.style.join(', ')}{' '}
              </p>
              <p className='text-neutral-600 text-sm dark:text-neutral-300 text-wrap max-w-[375px] text-start'>
                {t('typography.' + font.id)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
