import { getAllCommittees } from '@/api/committee'
import UploadForm from '@/app/[language]/upload/form'
import { useTranslation } from '@/app/i18n'
import HeaderGap from '@/components/header/components/HeaderGap'
import type { LanguageCode } from '@/models/Language'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

export default async function Home(props: Props) {
  const { language } = await props.params
  const { t } = await useTranslation(language, 'home')
  const { t: errors } = await useTranslation(language, 'errors')
  const { data: committees, error } = await getAllCommittees('en')
  if (error) {
    return (
      <div>
        {errors('committees.notFound')} <br />
        <span>{error.name}</span> <br />
        <span>{error.message}</span>
      </div>
    )
  }

  return (
    <main className='bg-neutral-100 dark:bg-neutral-900'>
      <HeaderGap />
      <div className='container my-4'>
        <UploadForm language={language} committees={committees} />
      </div>
      <div className='bg-white border-t-2 border-black py-8 dark:bg-neutral-800 dark:border-neutral-700'>
        <div className='container'>
          <h1 className='text-3xl font-bold'>{t('information')}</h1>
          <br />
          {/* TODO: Better description */}
          <p>
            {t('information.description_1')}
            <br />
            <br />
            {t('information.description_2')}
            <br />
            <br />
          </p>
        </div>
      </div>
    </main>
  )
}
