import { getAllCommittees } from '@/api/committee'
import UploadForm from '@/app/[language]/upload/form'
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
  const { data: committees, error } = await getAllCommittees('en')
  if (error) {
    return (
      <div>
        Error loading committees <br />
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
          <h1 className='text-3xl font-bold'>Information</h1>
          <br />
          {/* TODO: Better description */}
          <p>
            Hello! This is an accounting system, where you can upload your
            invoices and expenses.
            <br />
            <br />
            This is a work in progress, so please be patient with us. If you
            have any questions or feedback, please let us know.
            <br />
            <br />
          </p>
        </div>
      </div>
    </main>
  )
}
