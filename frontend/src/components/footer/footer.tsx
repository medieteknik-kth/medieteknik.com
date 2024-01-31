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
    <footer className='w-screen h-[512px] sm:h-80 text-sm bg-stone-900 text-white flex flex-col items-center justify-between'>
      <div className='w-full flex justify-center'>
        <ul className='w-full sm:w-1/2 flex justify-evenly items-center sm:items-baseline flex-col sm:flex-row mt-8'>
          {footerElements.map((element: FooterElement, index: number) => {
            return (
              <li key={index} className='w-1/2 mt-6 sm:w-72 sm:mt-0 first:mt-0'>
                <h3 className='mb-4 sm:h-14 sm:mb-0 font-semibold text-center lg:mb-4 lg:h-fit'>{element.title}</h3>
                <ul className='w-full text-center'>
                  {element.children.map((childElement, childIndex) => {
                    return (
                      <li key={childIndex} className='sm:mb-4 last:mb-0 lg:mb-0'>
                        <Link href={childElement.url}>{childElement.title}</Link>
                      </li>
                    )})}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
        <p className='mb-8 h-1/3 pt-8 px-8 text-xs xs:text-sm xs:pt-16 xs:px-16 flex items-center sm:h-fit'>{t('copyright')}</p>
      </footer>
    )
}
