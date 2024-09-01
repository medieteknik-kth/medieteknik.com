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
import { KeyboardEvent, MouseEvent, useCallback } from 'react'
import FallbackLogo from 'public/images/logo.webp'
import Image from 'next/image'
import { Author } from '@/models/Items'
import Committee, { CommitteePosition } from '@/models/Committee'
import { useTranslation } from '@/app/i18n/client'
import { useDocumentManagement } from '@/providers/DocumentProvider'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { Permission, Role } from '@/models/Permission'
import Link from 'next/link'
import { TFunction } from 'next-i18next'
import { Separator } from '@/components/ui/separator'

type Type = 'all' | 'documents' | 'forms'

interface Props {
  language: string
  type: Type
}

export default function GridView({ language, type }: Props) {
  const reroute = (url: string) => {
    window.open(url, '_blank')
  }

  const { documents, selectedDocuments, setSelectedDocuments } =
    useDocumentManagement()
  const { permissions, role } = useAuthentication()
  const { t } = useTranslation(language, 'document')

  const handleDocumentClick = useCallback(
    (event: MouseEvent, document: Document) => {
      const index = selectedDocuments.indexOf(document)
      if (event.ctrlKey || event.metaKey) {
        if (index > -1) {
          const newSelectedDocuments = [...selectedDocuments]
          newSelectedDocuments.splice(index, 1)
          setSelectedDocuments(newSelectedDocuments)
        } else {
          setSelectedDocuments([...selectedDocuments, document])
        }
      } else {
        if (index > -1) {
          reroute(document.translations[0].url)
        } else {
          setSelectedDocuments([document])
        }
      }
    },
    [selectedDocuments, setSelectedDocuments]
  )

  const handleDocumentKeydown = useCallback(
    (event: KeyboardEvent, document: Document) => {
      const index = selectedDocuments.indexOf(document)
      if (event.key === 'Enter') {
        if (event.ctrlKey || event.metaKey) {
          if (index > -1) {
            const newSelectedDocuments = [...selectedDocuments]
            newSelectedDocuments.splice(index, 1)
            setSelectedDocuments(newSelectedDocuments)
          } else {
            setSelectedDocuments([...selectedDocuments, document])
          }
        } else {
          if (index > -1) {
            reroute(document.translations[0].url)
          } else {
            setSelectedDocuments([document])
          }
        }
      }
    },
    []
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
    <div className='pl-72 pr-20 mt-4 flex flex-col gap-6 mb-4'>
      <div className='w-full flex flex-wrap gap-4'>
        {documents.length > 0 &&
          documents
            .filter(
              (document) =>
                type === 'all' ||
                (type === 'documents' &&
                  document.document_type === 'DOCUMENT') ||
                (type === 'forms' && document.document_type === 'FORM')
            )
            .filter((document) => document.is_pinned)
            .sort((a, b) =>
              a.is_pinned === b.is_pinned ? 0 : a.is_pinned ? -1 : 1
            )
            .map((document, documentIndex) =>
              renderDocuments(
                documentIndex,
                selectedDocuments,
                document,
                handleDocumentClick,
                handleDocumentKeydown,
                t,
                authorImage,
                authorName
              )
            )}
      </div>
      <Separator />
      <div className='w-full flex flex-wrap gap-4'>
        {documents.length > 0 &&
          documents
            .filter(
              (document) =>
                type === 'all' ||
                (type === 'documents' &&
                  document.document_type === 'DOCUMENT') ||
                (type === 'forms' && document.document_type === 'FORM')
            )
            .filter((document) => !document.is_pinned)
            .sort((a, b) =>
              a.is_pinned === b.is_pinned ? 0 : a.is_pinned ? -1 : 1
            )
            .map((document, documentIndex) =>
              renderDocuments(
                documentIndex,
                selectedDocuments,
                document,
                handleDocumentClick,
                handleDocumentKeydown,
                t,
                authorImage,
                authorName
              )
            )}
      </div>
    </div>
  )
}
function renderDocuments(
  documentIndex: number,
  selectedDocuments: Document[],
  document: Document,
  handleDocumentClick: (event: MouseEvent, document: Document) => void,
  handleDocumentKeydown: (event: KeyboardEvent, document: Document) => void,
  t: TFunction,
  authorImage: (author: Author) => string | null | undefined,
  authorName: (author: Author) => string
) {
  return (
    <div
      key={documentIndex}
      tabIndex={0}
      className={`w-60 h-64 rounded-md border cursor-pointer px-4 flex flex-col justify-between
          ${
            selectedDocuments.includes(document)
              ? 'border-yellow-400 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-800 dark:hover:bg-yellow-700'
              : 'bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700'
          }
        `}
      title={document.translations[0].title}
      onClick={(event) => {
        event.stopPropagation()
        handleDocumentClick(event, document)
      }}
      onKeyDown={(event) => {
        handleDocumentKeydown(event, document)
      }}
    >
      <div className='w-full h-fit flex items-center justify-between py-2'>
        <div className='flex items-center gap-2'>
          {document.document_type === 'DOCUMENT' ? (
            <DocumentIcon className='w-5 h-5 text-green-500' title='Document' />
          ) : (
            <DocumentTextIcon
              className='w-5 h-5 text-amber-500'
              title='Document type is a Form'
            />
          )}
          <span className='sr-only'>Document type is a document</span>
          <p className='tracking-wide text-sm truncate max-w-44'>
            {document.translations[0].title}
          </p>
        </div>
      </div>
      <div
        id='preview'
        className='w-full h-full bg-neutral-200 grid place-items-center dark:bg-neutral-700'
      >
        <p className='text-xs select-none uppercase tracking-widest text-center'>
          {t('no_preview')}
        </p>
      </div>
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
  )
}
