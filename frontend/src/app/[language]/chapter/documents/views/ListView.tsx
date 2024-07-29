'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Committee, { CommitteePosition } from '@/models/Committee'
import { Document } from '@/models/Document'
import { Author } from '@/models/Items'
import Student from '@/models/Student'
import { DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import FallbackLogo from 'public/images/logo.webp'
import { MouseEvent, useCallback } from 'react'

interface Props {
  documents: Document[]
  selectedDocuments: number[]
  setSelectedDocuments: React.Dispatch<React.SetStateAction<number[]>>
  language: string
}

export default function ListView({
  documents,
  selectedDocuments,
  setSelectedDocuments,
  language,
}: Props) {
  const reroute = (url: string) => {
    window.open(url, '_blank')
  }

  const handleDocumentClick = useCallback(
    (event: MouseEvent, documentIndex: number, document: Document) => {
      const index = selectedDocuments.indexOf(documentIndex)
      if (event.ctrlKey || event.metaKey) {
        if (index > -1) {
          const newSelectedDocuments = [...selectedDocuments]
          newSelectedDocuments.splice(index, 1)
          setSelectedDocuments(newSelectedDocuments)
        } else {
          setSelectedDocuments([...selectedDocuments, documentIndex])
        }
      } else {
        if (index > -1) {
          reroute(document.url)
        } else {
          setSelectedDocuments([documentIndex])
        }
      }
    },
    [selectedDocuments, setSelectedDocuments]
  )

  const authorImage = (author: Author) => {
    switch (author.author_type) {
      case 'STUDENT':
        const student = author as Student
        return student.profile_picture_url
      case 'COMMITTEE':
        const committee = author as Committee
        return committee.logo_url
      case 'COMMITTEE_POSITION':
        const committeePosition = author as CommitteePosition
        return null
      default:
        throw new Error('Unknown author type')
    }
  }

  const authorName = (author: Author) => {
    switch (author.author_type) {
      case 'STUDENT':
        const student = author as Student
        return student.first_name + ' ' + student.last_name
      case 'COMMITTEE':
        const committee = author as Committee
        return committee.translations[0].title
      case 'COMMITTEE_POSITION':
        const committeePosition = author as CommitteePosition
        return committeePosition.translations[0].title
      default:
        throw new Error('Unknown author type')
    }
  }

  return (
    <div className='pl-72 pr-20 mt-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-96'>Name</TableHead>
            <TableHead className='w-40'>Changed</TableHead>
            <TableHead className='w-80'>Author</TableHead>
            <TableHead className='text-right w-40'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document, documentIndex) => (
            <TableRow
              key={documentIndex}
              className={`cursor-pointer ${
                selectedDocuments.includes(documentIndex)
                  ? 'bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-800 dark:hover:bg-yellow-700'
                  : 'hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700'
              }`}
              onClick={(event) => {
                event.stopPropagation()
                handleDocumentClick(event, documentIndex, document)
              }}
            >
              <TableCell>
                <div className='flex gap-2 items-center'>
                  {document.type === 'DOCUMENT' ? (
                    <DocumentIcon
                      className='w-5 h-5 text-green-500'
                      title='Document'
                    />
                  ) : (
                    <DocumentTextIcon
                      className='w-5 h-5 text-amber-500'
                      title='Document type is a Form'
                    />
                  )}
                  <span className='sr-only'>Document type is a document</span>
                  <p className='tracking-wide text-sm max-w-96 truncate'>
                    {document.translations[0].title}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <span className='sr-only'>Changed</span>
                {new Date(document.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className='flex gap-2 items-center'>
                <span className='sr-only'>Author</span>
                <Avatar className='bg-white mr-2'>
                  <AvatarImage
                    src={authorImage(document.author) || ''}
                    width={128}
                    height={128}
                    alt='Author: Firstname Lastname'
                    className='h-full w-auto'
                  />
                  <AvatarFallback className='bg-white p-1'>
                    <Image
                      src={FallbackLogo}
                      alt='Author: Firstname Lastname'
                    />
                  </AvatarFallback>
                </Avatar>
                <p className='tracking-wide text-sm max-w-52 truncate'>
                  {authorName(document.author)}
                </p>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}