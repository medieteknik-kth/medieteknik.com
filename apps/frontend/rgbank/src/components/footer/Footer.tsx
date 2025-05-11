import { getTranslation } from '@/app/i18n'
import AboutSection from '@/components/footer/sections/About'
import ContactSection from '@/components/footer/sections/Contact'
import IssueSection from '@/components/footer/sections/Issues'
import { Button } from '@/components/ui/button'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { Link } from 'next-view-transitions'
import Image from 'next/image'
import type { JSX } from 'react'

/**
 * Renders the footer for all pages
 * @name Footer
 *
 * @param {string} language - The language of the current page
 * @returns {JSX.Element} The footer
 */
export default async function Footer({
  language,
}: {
  language: LanguageCode
}): Promise<JSX.Element> {
  const { t } = await getTranslation(language, 'footer')
  return (
    <footer className='w-full h-fit xl:h-[420px] text-sm flex flex-col items-center justify-center xl:justify-between border-t-2 bg-white text-black border-neutral-200 dark:bg-[#111] dark:text-white dark:border-neutral-700'>
      <div className='w-full h-full mt-8 xl:mt-0 md:h-3/5 flex flex-col md:flex-row justify-around items-center'>
        <Link
          href='/'
          title='Home'
          aria-label='Home'
          className='w-fit h-40 grid place-items-center'
        >
          <Image
            src='https://storage.googleapis.com/medieteknik-static/static/dark_logobig.webp'
            alt='logo'
            width={320}
            height={128}
            loading={'lazy'}
            className='w-auto h-14 xxs:h-24 xs:h-auto hidden dark:block'
          />
          <Image
            src='https://storage.googleapis.com/medieteknik-static/static/light_logobig.webp'
            alt='logo'
            width={320}
            height={128}
            loading={'lazy'}
            className='w-auto h-14 xxs:h-24 xs:h-auto block dark:hidden'
          />
        </Link>
        <div className='w-full h-fit relative xs:px-20 md:px-0 md:w-1/3 xl:w-3/4 xxs:h-full flex items-center justify-around lg:justify-center'>
          <ul className='w-full h-fit xl:mt-2 flex flex-col items-center xl:items-start xl:flex-row space-between xl:justify-around'>
            <AboutSection language={language} />
            <ContactSection language={language} />
            <IssueSection language={language} />
          </ul>
        </div>
      </div>
      <div>
        <Button variant={'ghost'} asChild>
          <a href={`https://www.medieteknik.com/${language}/privacy`}>
            {t('privacy_policy.title')}
          </a>
        </Button>
      </div>
      <p className='md:mt-4 xxs:mb-20 px-4 xs:px-20 xxs:px-10 text-xs grid place-items-center'>
        {t('copyright.content')}
      </p>
    </footer>
  )
}
