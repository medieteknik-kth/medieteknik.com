import Masters from './client/masters'
import Courses from './client/courses'
import KTH from 'public/images/svg/kth.svg'
import { HeadComponent, Section } from '@/components/static/Static'
import Link from 'next/link'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/app/i18n'
import HeaderGap from '@/components/header/components/HeaderGap'

interface Props {
  params: {
    language: string
  }
}

/**
 * @name Education
 * @description The education page, with useful information regarding courses, possible master degrees, and other useful information
 *
 * @param {object} params - The dynamic route parameters
 * @param {string} params.language - The language of the page
 * @returns {Promise<JSX.Element>} The education page
 */
export default async function Education({
  params: { language },
}: Props): Promise<JSX.Element> {
  const { t } = await useTranslation(language, 'education')
  return (
    <main>
      <HeaderGap />
      <HeadComponent title={t('title')} description={t('description')}>
        <div className='absolute left-20 bottom-4 flex gap-8'>
          <Button
            size={'icon'}
            className='overflow-hidden hover:scale-110 transition-all'
            title='KTH Website (in Swedish)'
            aria-label='KTH Website (in Swedish)'
            asChild
          >
            <Link
              href={`https://www.kth.se/utbildning/civilingenjor/medieteknik/medieteknik-civilingenjor-300-hp-1.4150`}
              target='_blank'
              rel='noreferrer noopenner'
            >
              <KTH className='w-10 h-10 rounded-md' />
            </Link>
          </Button>
          <Button
            variant={'outline'}
            size={'icon'}
            className='overflow-hidden hover:scale-110 transition-all'
            asChild
          >
            <Link
              href={`https://meta-internationals.mailchimpsites.com/`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                src={
                  'https://storage.googleapis.com/medieteknik-static/committees/internationals.svg'
                }
                alt='img'
                width={200}
                height={200}
                className='w-10 h-10'
              />
            </Link>
          </Button>
        </div>
      </HeadComponent>

      <Courses language={language} />

      <Masters language={language} />

      <Section title={t('study_counselor')}>
        <div className='w-full h-fit flex justify-center items-center py-10 gap-20 flex-wrap'>
          <div className='w-fit xl:w-[750px] h-3/4 flex flex-col justify-center px-10'>
            <p>
              Lena Smedenborn är studievägledare för studenter på
              civilingenjörsprogrammet i medieteknik. Du kan vända dig till
              henne om du har frågor om bland annat studieplanering, kursval,
              studievanor och studieteknik eller återupptag av studier efter
              studieuppehåll.
            </p>
            <div className='flex flex-col gap-4'>
              <div className='flex justify-start items-center flex-wrap gap-2'>
                <div className='w-12 h-12 grid place-items-center rounded-full'>
                  <EnvelopeIcon className='w-8 h-8' />
                </div>
                <Link
                  href='mailto:svl-media@kth.se'
                  rel='noopener noreferrer'
                  className='text-blue-600 dark:text-yellow-400 underline-offset-2 hover:underline'
                >
                  svl-media@kth.se
                </Link>
              </div>
              <div className='flex justify-start items-center flex-wrap gap-2'>
                <div className='w-12 h-12 grid place-items-center rounded-full'>
                  <PhoneIcon className='w-8 h-8' />
                </div>
                <p>08-790 84 07</p>
              </div>
              <div className='flex justify-start items-center flex-wrap gap-2'>
                <div className='w-12 h-12 grid place-items-center rounded-full'>
                  <MapPinIcon className='w-8 h-8' />
                </div>
                <p>Rum 1434, Lindstedtsvägen 3, plan 4</p>
              </div>
              <Link
                href='https://www.kth.se/profile/lenasm'
                target='_blank'
                className='flex h-20 items-center gap-2 hover:underline underline-offset-4 dark:decoration-yellow-400 decoration-sky-700 border rounded-md px-4 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              >
                <KTH className='w-10 h-10 rounded-md' />
                Se hela profilen på KTH.se
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </main>
  )
}
