import { getAllCommittees } from '@/api/committee'
import UploadForm from '@/app/[language]/upload/form'

export default async function Upload() {
  const { data: committees, error } = await getAllCommittees('en', 0)
  if (error) {
    return (
      <div>
        Error loading committees <br />
        <span>{error.name}</span> <br />
        <span>{error.message}</span>
      </div>
    )
  }
  return <UploadForm committees={committees} />
}
