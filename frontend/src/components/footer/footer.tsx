import React from 'react';
import { useTranslation } from '../../app/i18n'
import Link from 'next/link';

type FooterElement = {
  title: string,
  children: {
    title: string,
    url: string
  }[]
}

export default async function Footer({ params: { language } }: { params: { language: string } }) {
  const { t } = await useTranslation(language, 'footer')
  const footerElements: FooterElement[] = t('elements', { returnObjects: true } );

  return (
    <div className='w-full h-80 text-sm bg-stone-900 text-white flex flex-col items-center justify-between'>
      <div className='w-full'>
        <ul className='flex justify-center mt-8'>
          {footerElements.map((element: FooterElement, index: number) => {
            return (
              <li key={index} className='mx-16'>
                <h3 className='mb-4 font-semibold'>{element.title}</h3>
                <ul>
                  {element.children.map((childElement, childIndex) => {
                    return (
                      <li key={childIndex}>
                        <Link href={childElement.url}>{childElement.title}</Link>
                      </li>
                    )})}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
        <p className='mb-8'>{t('copyright')}</p>
      </div>
    )
}
