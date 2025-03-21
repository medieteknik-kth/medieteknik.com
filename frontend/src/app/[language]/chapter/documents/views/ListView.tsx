'use client'

import type { TypeOfDocument } from '@/app/[language]/chapter/documents/utility/util'
import { useTranslation } from '@/app/i18n/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type Committee from '@/models/Committee'
import type { CommitteePosition } from '@/models/Committee'
import type { Author } from '@/models/Items'
import type { LanguageCode } from '@/models/Language'
import type Student from '@/models/Student'
import type Document from '@/models/items/Document'
import { useDocumentManagement } from '@/providers/DocumentProvider'
import {
  DocumentIcon,
  DocumentTextIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import FallbackLogo from 'public/images/logo.webp'
import { type JSX, type MouseEvent, useCallback } from 'react'

interface Props {
  language: LanguageCode
  type: TypeOfDocument
}

/**
 * @name ListView
 * @description A component that displays a list of documents.
 *
 * @param {Props} props - The props for the component.
 * @param {string} props.language - The current language of the application.
 * @param {Type} props.type - The type of documents to display.
 * @returns {JSX.Element} The JSX code for the ListView component.
 */
export default function ListView({ language, type }: Props): JSX.Element {
  const {
    documents,
    selectedDocuments,
    setSelectedDocuments,
    page,
    next,
    total_pages,
  } = useDocumentManagement()

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
          window.open(document.translations[0].url, '_blank')
        } else {
          setSelectedDocuments([document])
        }
      }
    },
    [selectedDocuments, setSelectedDocuments]
  )

  const authorImage = (author: Author) => {
    switch (author.author_type) {
      case 'STUDENT': {
        const student = author as Student
        return student.profile_picture_url
      }
      case 'COMMITTEE': {
        const committee = author as Committee
        return committee.logo_url
      }
      case 'COMMITTEE_POSITION': {
        const committeePosition = author as CommitteePosition
        return committeePosition.committee?.logo_url || ''
      }
      default:
        throw new Error('Unknown author type')
    }
  }

  const authorName = (author: Author) => {
    switch (author.author_type) {
      case 'STUDENT': {
        const student = author as Student
        return `${student.first_name} ${student.last_name || ''}`
      }
      case 'COMMITTEE': {
        const committee = author as Committee
        return committee.translations[0].title
      }
      case 'COMMITTEE_POSITION': {
        const committeePosition = author as CommitteePosition
        return committeePosition.translations[0].title
      }
      default:
        throw new Error('Unknown author type')
    }
  }

  return (
    <div className='lg:pl-72 px-4 lg:pr-20 flex flex-col gap-4 my-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-96'>{t('view.list.name')}</TableHead>
            <TableHead className='w-40'>{t('view.list.changed')}</TableHead>
            <TableHead className='w-80'>{t('view.list.author')}</TableHead>
            <TableHead className='text-right w-20'>
              {t('view.list.metadata')}
            </TableHead>
            <TableHead className='text-right w-40'>
              {t('view.list.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents &&
            documents.length > 0 &&
            documents
              .filter(
                (document) =>
                  type === 'all' ||
                  (type === 'documents' &&
                    document.document_type === 'DOCUMENT') ||
                  (type === 'forms' && document.document_type === 'FORM')
              )
              .sort((a, b) =>
                a.is_pinned === b.is_pinned ? 0 : a.is_pinned ? -1 : 1
              )
              .map((document) => (
                <TableRow
                  key={`${document.translations[0].title}_${document.created_at}`}
                  className={`cursor-pointer ${
                    selectedDocuments.includes(document)
                      ? 'bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-800 dark:hover:bg-yellow-700'
                      : 'hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                  }`}
                  onClick={(event) => {
                    event.stopPropagation()
                    handleDocumentClick(event, document)
                  }}
                >
                  <TableCell>
                    <div className='flex gap-2 items-center'>
                      {document.document_type === 'DOCUMENT' ? (
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
                      <span className='sr-only'>
                        Document type is a document
                      </span>
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
                    <span className='sr-only'>{t('view.list.author')}</span>
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
                  <TableCell className=''>
                    <div className='flex justify-end gap-2'>
                      {document.is_pinned && (
                        <StarIcon
                          className='w-5 h-5 text-yellow-500 self-end'
                          title='Pinned'
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      {page < total_pages && (
        <Button
          className='w-full self-center'
          variant={'secondary'}
          onClick={() => next()}
        >
          {t('load_more')}
        </Button>
      )}
    </div>
  )
}
