'use client'
import { useTranslation } from '@/app/i18n/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LanguageCode } from '@/models/Language'
import { UsersIcon } from '@heroicons/react/24/outline'

export default function ExploreMore({
  language,
  committee,
}: {
  language: LanguageCode
  committee: string
}) {
  const committeeName = decodeURIComponent(committee)
  const { t } = useTranslation(language, 'committee')

  return (
    <section className='h-fit'>
      <div className='pt-12 mb-10 grid place-items-center'>
        <h2 className='text-3xl capitalize'>{t('explore_more')}</h2>
        <div className='flex flex-wrap gap-12 justify-center my-8'>
          <Card
            className='bg-yellow-100 dark:bg-yellow-300 hover:scale-110 transition-transform cursor-pointer dark:text-black'
            onClick={() => {
              location.href = '/chapter/media/' + committee
            }}
          >
            <CardHeader>
              <div className='w-16 h-16 grid place-items-center border rounded-full bg-yellow-400 dark:bg-yellow-500'>
                <UsersIcon className='w-6 h-6 text-white' />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle>Media</CardTitle>
              <p className='max-w-xs'>
                See the latest media from{' '}
                <span className='capitalize font-bold'>{committeeName}</span>?
                Click here to see latest media
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
