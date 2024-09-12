'use client'
import { useDocumentManagement } from '@/providers/DocumentProvider'
import GridView from '../views/GridView'
import ListView from '../views/ListView'

type Type = 'all' | 'documents' | 'forms' | 'archived'

interface Props {
  language: string
  type: Type
}

export default function View({ language, type }: Props) {
  const { setSelectedDocuments, view } = useDocumentManagement()

  return (
    <div
      className='min-h-[1080px] h-fit'
      onClick={() => {
        setSelectedDocuments([])
      }}
    >
      {view === 'grid' ? (
        <GridView language={language} type={type} />
      ) : (
        <ListView language={language} type={type} />
      )}
    </div>
  )
}
