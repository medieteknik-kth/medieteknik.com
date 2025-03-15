import { useTranslation } from '@/app/i18n'
import { Button } from '@/components/ui/button'
import type { LanguageCode } from '@/models/Language'
import { SignalSlashIcon } from '@heroicons/react/24/outline'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

export default async function OfflineFallback(props: Props) {
  const { language } = await props.params
  const { t } = await useTranslation(language, 'offline')
  return (
    <div className='grid place-items-center min-h-[1080px]'>
      <div className='flex flex-col items-center gap-4'>
        <SignalSlashIcon className='w-20 h-20 text-red-500 animate-pulse duration-[5s]' />
        <h1 className='text-3xl font-semibold'>{t('title')}</h1>
        <p>{t('description')}</p>
        <Button asChild>
          <a href={`/${language}`}>{t('home')}</a>
        </Button>
      </div>
    </div>
  )
}
