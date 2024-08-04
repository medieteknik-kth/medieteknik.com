'use client'
import { ClockIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Committee from '@/models/Committee'
import Link from 'next/link'
import { CommitteeTag } from '@/components/tags/CommitteeTag'
import { useTranslation } from '@/app/i18n/client'

interface Response {
  committee: Committee
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
          <div className='w-full h-full flex flex-wrap gap-8'>
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
              data.map((recruit, index) => (
                <Card key={index} className='w-[500px] h-[220px]'>
                  <CardHeader className='h-fit flex flex-row items-center justify-between'>
                    <div className='flex items-center'>
                      <div>
                        <CardTitle className='text-xl'>
                          <CommitteeTag
                            committee={recruit.committee}
                            includeAt={false}
                            includeBackground={false}
                          >
                            <span className='text-sm flex items-center font-normal text-neutral-700'>
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
                        </CardTitle>
                        <CardDescription className='flex items-center mt-1'></CardDescription>
                      </div>
                    </div>
                    <Button title='Learn More' aria-label='Learn More' asChild>
                      <Link href={recruit.translations[0].link_url}>
                        Learn More
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent className='text-sm w-full max-w[450px] text-pretty break-words'>
                    <p>{recruit.translations[0].description}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
