import { useTranslation } from '@/app/i18n'
import { HeadComponent } from '@/components/static/Static'
import { Button } from '@/components/ui/button'
import type { LanguageCode } from '@/models/Language'
import { UPDATES } from '@/utility/Updates'
import { Link } from 'next-view-transitions'

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
        {UPDATES.filter((update) =>
          update.translations.some(
            (translation) => translation.language_code === language
          )
        ).map((update) => (
          <Button
            key={update.notification_id}
            variant={'outline'}
            asChild
            className='flex justify-start items-center h-full w-full'
          >
            <Link href={`/${language}${update.translations[0].url}`}>
              <section className='w-full lg:w-1/2'>
                <h2 className='text-2xl font-bold'>
                  {commonT('title')} v{update.notification_id}
                </h2>
                <p className='text-sm text-gray-500'>
                  {update.created_at} &middot; {update.translations[0].title}
                </p>
                <p className='text-base'>{update.translations[0].body}</p>
              </section>
            </Link>
          </Button>
        ))}
      </div>
    </main>
  )
}
