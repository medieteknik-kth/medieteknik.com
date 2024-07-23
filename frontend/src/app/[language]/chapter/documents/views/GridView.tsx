'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Document } from '@/models/Document'
import Student from '@/models/Student'
import {
  DocumentIcon,
  DocumentTextIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline'
import { MouseEvent, useCallback } from 'react'
import FallbackLogo from 'public/images/logo.webp'
import Image from 'next/image'
import { Author } from '@/models/Items'
import Committee, { CommitteePosition } from '@/models/Committee'

interface Props {
  documents: Document[]
  selectedDocuments: number[]
  setSelectedDocuments: React.Dispatch<React.SetStateAction<number[]>>
  language: string
}

export default function GridView({
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
    <div className='flex gap-4 flex-wrap pl-72 pr-20 mt-4'>
      {documents.map((document, documentIndex) => (
        <div
          key={documentIndex}
          className={`w-60 h-64 rounded-md border cursor-pointer px-4 flex flex-col justify-between
          ${
            selectedDocuments.includes(documentIndex)
              ? 'border-yellow-400 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-800 dark:hover:bg-yellow-700'
              : 'bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700'
          }
        `}
          title={document.translations[0].title}
          onClick={(event) => {
            event.stopPropagation()
            handleDocumentClick(event, documentIndex, document)
          }}
        >
          <div className='w-full h-fit flex items-center justify-between py-2'>
            <div className='flex items-center gap-2'>
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
              <p className='tracking-wide text-sm truncate max-w-36'>
                {document.translations[0].title}
              </p>
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='w-fit h-fit p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-md z-10'
              onClick={(event) => {
                event.stopPropagation()
              }}
            >
              <EllipsisVerticalIcon className='w-5 h-5 ' />
            </Button>
          </div>
          <div id='preview' className='w-full h-full bg-white' />
          <div className='w-full h-fit flex items-center py-2'>
            <Avatar className='bg-white mr-2'>
              <AvatarImage
                src={authorImage(document.author) || ''}
                width={128}
                height={128}
                alt='Author: Firstname Lastname'
                className='h-full w-auto'
              />
              <AvatarFallback className='bg-white p-1'>
                <Image src={FallbackLogo} alt='Author: Firstname Lastname' />
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <p
                className='text-sm max-w-36 truncate'
                title={authorName(document.author)}
              >
                {authorName(document.author)}
              </p>
              <p className='text-xs text-neutral-500 dark:text-neutral-300'>
                {new Date(document.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
