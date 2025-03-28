import { getAllCommittees } from '@/api/committee'
import UploadForm from '@/app/[language]/upload/form'
import HeaderGap from '@/components/header/components/HeaderGap'

export default async function Upload() {
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
    <main>
      <HeaderGap />
      <UploadForm committees={committees} />
    </main>
  )
}
