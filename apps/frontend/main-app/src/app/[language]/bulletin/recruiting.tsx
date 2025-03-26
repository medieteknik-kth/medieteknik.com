import { useTranslation } from '@/app/i18n'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import type { CommitteePositionRecruitment } from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'
import { Link } from 'next-view-transitions'
import Image from 'next/image'

import type { JSX } from 'react'

interface Props {
  language: LanguageCode
  data: CommitteePositionRecruitment[]
}

/**
 * @name Recruitment
 * @description Renders the recruitment section of the bulletin.
 *
 * @param {Props} props -
 * @param {string} props.language - The language of the bulletin.
 * @param {Response[]} props.data - The recruitment data.
 *
 * @returns {Promise<JSX.Element>} The recruitment section of the bulletin.
 */
export default async function Recruitment({
  language,
  data,
}: Props): Promise<JSX.Element> {
  const { t } = await useTranslation(language, 'bulletin')

  return (
    <section
      id='recruitment'
      className='w-full desktop:grow desktop:w-min h-auto flex flex-col justify-between'
    >
      <div className='desktop:text-end'>
        <h2 className='uppercase text-neutral-600 dark:text-neutral-400 tracking-wide select-none leading-4'>
          {t('recruitment')}
        </h2>

        <p className='text-2xl font-bold mb-3'>{t('committees')}</p>
      </div>

      <div className='w-full h-fit flex items-center'>
        <div className='w-full h-full overflow-x-auto'>
          <div className='w-full h-fit desktop:h-[788px] rounded-lg'>
            {data.length === 0 && (
              <p className='w-full min-h-20 h-full grid place-items-center z-10 uppercase tracking-wider text-neutral-800 dark:text-neutral-300 select-none bg-neutral-100 dark:bg-neutral-800 rounded-lg'>
                {t('no_recruitment')}
              </p>
            )}
            <Accordion
              type='single'
              collapsible
              className='grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(33rem,1fr))] desktop:grid-cols-1 gap-1'
            >
              {data.length > 0 &&
                data
                  .sort(
                    (a, b) =>
                      new Date(a.end_date).getTime() -
                      new Date(b.end_date).getTime()
                  )
                  .map((recruit, index) => (
                    <AccordionItem
                      value={index.toString()}
                      key={`${recruit.committee_position.committee_position_id}_${recruit.start_date}`}
                      className='max-w-full w-full rounded-b-lg'
                    >
                      <AccordionTrigger className='w-full h-[7.9375rem] border border-b-0 p-4 no-underline! flex items-center rounded-lg data-[state=open]:rounded-bl-none data-[state=open]:rounded-br-none'>
                        {recruit.committee_position.committee && (
                          <div className='w-fit h-full flex flex-col justify-around'>
                            <div className='w-fit flex items-center gap-2'>
                              <div className='bg-white p-1 w-14 rounded-full overflow-hidden'>
                                <Image
                                  src={
                                    recruit.committee_position.committee
                                      .logo_url
                                  }
                                  alt={
                                    recruit.committee_position.committee
                                      .translations[0].title
                                  }
                                  unoptimized // Logo is an SVG
                                  width={56}
                                  height={56}
                                />
                              </div>
                              <div className='flex flex-col text-sm'>
                                <p className='text-lg font-semibold'>
                                  {
                                    recruit.committee_position.translations[0]
                                      .title
                                  }
                                </p>
                                <p className='w-fit'>
                                  {
                                    recruit.committee_position.committee
                                      .translations[0].title
                                  }
                                </p>
                              </div>
                            </div>
                            <div className='w-fit flex justify-between text-xs text-muted-foreground gap-4'>
                              <div
                                className='flex items-center'
                                title={new Date(
                                  recruit.end_date
                                ).toLocaleDateString(language, {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                })}
                              >
                                <ClockIcon className='w-4 h-4 mr-1' />
                                {new Date(recruit.end_date).toLocaleDateString(
                                  language,
                                  {
                                    day: 'numeric',
                                  }
                                )}
                                &nbsp;days left
                              </div>
                              <div className='flex items-center'>
                                <CalendarIcon className='w-4 h-4 mr-1' />
                                Started{' '}
                                {new Date(
                                  recruit.start_date
                                ).toLocaleDateString(language)}
                              </div>
                            </div>
                          </div>
                        )}
                      </AccordionTrigger>
                      <AccordionContent className='p-4 pt-0 border-r border-l rounded-b-lg'>
                        <div className='text-sm text-gray-600 dark:text-gray-300 break-words whitespace-pre-line'>
                          <p>{recruit.translations[0].description}</p>
                        </div>
                        <Button asChild className='w-full mt-4'>
                          <Link
                            href={recruit.translations[0].link_url}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            Learn More
                          </Link>
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
