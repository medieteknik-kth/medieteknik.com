'use client'

import type { TypeOfDocument } from '@/app/[language]/chapter/documents/utility/util'
import type { LanguageCode } from '@/models/Language'
import { useDocumentManagement } from '@/providers/DocumentProvider'
import type { JSX } from 'react'
import GridView from '../views/GridView'
import ListView from '../views/ListView'

interface Props {
  language: LanguageCode
  type: TypeOfDocument
}

/**
 * @name View
 * @description A component that is the parent of all document views.
 *
 * @param {Props} props - The props for the component.
 * @param {string} props.language - The current language of the application.
 * @param {Type} props.type - The type of documents to display.
 * @returns {JSX.Element} The JSX code for the View component.
 */
export default function View({ language, type }: Props): JSX.Element {
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
