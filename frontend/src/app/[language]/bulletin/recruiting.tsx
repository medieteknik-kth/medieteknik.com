'use client'
import { ClockIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CommitteePosition } from '@/models/Committee'
import Link from 'next/link'
import { CommitteeTag } from '@/components/tags/CommitteeTag'
import { useTranslation } from '@/app/i18n/client'

interface Response {
  committee_position: CommitteePosition
  start_date: string
  end_date: string
  translations: { description: string; link_url: string }[]
}

/**
 * @name Recruitment
 * @description Renders the recruitment section of the bulletin.
 *
 * @param {string} language - The language of the bulletin.
 * @returns {JSX.Element} The recruitment section of the bulletin.
 */
export default function Recruitment({
  language,
  data,
}: {
  language: string
  data: Response[]
}): JSX.Element {
  const { t } = useTranslation(language, 'bulletin')

  return (
    <section className='w-full h-fit flex flex-col justify-between relative mt-10'>
      <h2 className='uppercase text-neutral-600 dark:text-neutral-400 py-2 text-lg tracking-wide'>
        {t('recruitment')}
      </h2>
      <div className='w-full h-5/6 flex items-center mb-20'>
        <div className='w-full h-full overflow-x-auto'>
          <div className='w-full h-full flex flex-wrap gap-4 justify-center'>
            {data.length === 0 && (
              <p
                className='w-full h-[200px] grid place-items-center z-10 
          uppercase tracking-wider text-neutral-800 dark:text-neutral-300 
          select-none bg-neutral-100 dark:bg-neutral-800'
              >
                {t('no_recruitment')}
              </p>
            )}
            {data.length > 0 &&
              data
                .sort(
                  (a, b) =>
                    new Date(a.end_date).getTime() -
                    new Date(b.end_date).getTime()
                )
                .map((recruit, index) => (
                  <Card
                    key={index}
                    className='w-full sm:w-[470px] h-fit md:h-[260px] relative flex flex-col justify-between'
                  >
                    <CardHeader className='h-fit flex flex-row items-center justify-between'>
                      <div className='flex flex-col items-start'>
                        <div>
                          <CardTitle className='text-sm xxs:text-base sm:text-xl'>
                            {recruit.committee_position.committee && (
                              <CommitteeTag
                                committee={recruit.committee_position.committee}
                                includeAt={false}
                                includeBackground={false}
                              >
                                <span
                                  className='text-sm flex items-center font-normal text-neutral-700 dark:text-neutral-300'
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
                                  {Math.floor(
                                    (new Date(recruit.end_date).getTime() -
                                      Date.now()) /
                                      1000 /
                                      60 /
                                      60 /
                                      24
                                  )}{' '}
                                  days left
                                </span>
                              </CommitteeTag>
                            )}
                          </CardTitle>
                          <CardDescription className='flex items-center mt-1'></CardDescription>
                        </div>
                        <span className='font-mono uppercase text-xs select-none'>
                          Position:{' '}
                          {recruit.committee_position.translations[0].title}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className='text-sm w-full max-w-[450px] text-pretty break-words'>
                      <p>{recruit.translations[0].description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        title='Learn More'
                        aria-label='Learn More'
                        asChild
                        className='w-full'
                      >
                        <Link
                          href={recruit.translations[0].link_url}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          Learn More
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
          </div>
        </div>
      </div>
    </section>
  )
}
