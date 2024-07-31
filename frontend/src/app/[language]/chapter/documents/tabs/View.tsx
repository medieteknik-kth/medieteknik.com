'use client'
import { useState } from 'react'
import GridView from '../views/GridView'
import ListView from '../views/ListView'
import { Document } from '@/models/Document'

type View = 'grid' | 'list'

interface Props {
  language: string
  documents: Document[]
  currentView: View
  selectedDocuments: number[]
  setSelectedDocuments: (documents: number[]) => void
}

export default function View({
  language,
  documents,
  currentView,
  selectedDocuments,
  setSelectedDocuments,
}: Props) {
  return (
    <div
      className='min-h-[1080px] h-fit'
      onClick={() => {
        setSelectedDocuments([])
      }}
    >
      {currentView === 'grid' ? (
        <GridView
          documents={documents}
          selectedDocuments={selectedDocuments}
          setSelectedDocuments={setSelectedDocuments}
          language={language}
        />
      ) : (
        <ListView
          documents={documents}
          selectedDocuments={selectedDocuments}
          setSelectedDocuments={setSelectedDocuments}
          language={language}
        />
      )}
    </div>
  )
}
