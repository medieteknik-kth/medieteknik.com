import { getAllCommittees } from '@/api/committee'
import UploadForm from '@/app/[language]/upload/form'
import { getTranslation } from '@/app/i18n'
import HeaderGap from '@/components/header/components/HeaderGap'
import type { LanguageCode } from '@/models/Language'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

export default async function Upload(props: Props) {
  const { language } = await props.params
  const { data: committees, error } = await getAllCommittees(language)
  const { t: errors } = await getTranslation(language, 'errors')
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
      <div className='px-2 xs:px-0 xs:container py-4'>
        <UploadForm language={language} committees={committees} />
      </div>
    </main>
  )
}
