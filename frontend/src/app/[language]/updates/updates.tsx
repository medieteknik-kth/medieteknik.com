import { useTranslation } from '@/app/i18n'
import { HeadComponent } from '@/components/static/Static'
import { Button } from '@/components/ui/button'
import type { LanguageCode } from '@/models/Language'
import { UPDATES } from '@/utility/Updates'
import Link from 'next/link'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

export default async function Updates(props: Props) {
  const { language } = await props.params
  const { t: commonT } = await useTranslation(language, 'common')
  const { t } = await useTranslation(language, 'updates/common')
  return (
    <main>
      <HeadComponent title={t('title')} />
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 p-4 lg:p-8'>
        {UPDATES.map((update) => (
          <Button
            key={update.version}
            variant={'outline'}
            asChild
            className='flex justify-start items-center h-full w-full'
          >
            <Link href={`/${language}/updates/${update.version}`}>
              <section className='w-full lg:w-1/2'>
                <h2 className='text-2xl font-bold'>
                  {commonT('title')} v{update.version}
                </h2>
                <p className='text-sm text-gray-500'>
                  {update.date} &middot; {update.title}
                </p>
                <p className='text-base'>{update.description}</p>
              </section>
            </Link>
          </Button>
        ))}
      </div>
    </main>
  )
}
