'use client'

import { TypeOfDocument } from '@/app/[language]/chapter/documents/utility/util'
import { useTranslation } from '@/app/i18n/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Committee, { CommitteePosition } from '@/models/Committee'
import { Author } from '@/models/Items'
import Document from '@/models/items/Document'
import { LanguageCode } from '@/models/Language'
import Student from '@/models/Student'
import { useDocumentManagement } from '@/providers/DocumentProvider'
import { DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { TFunction } from 'next-i18next'
import Image from 'next/image'
import FallbackLogo from 'public/images/logo.webp'
import { KeyboardEvent, MouseEvent, useCallback, type JSX } from 'react'

interface Props {
  language: LanguageCode
  type: TypeOfDocument
}

/**
 * @name GridView
 * @description A component that displays a grid of documents.
 *
 * @param {Props} props - The props for the component.
 * @param {string} props.language - The current language of the application.
 * @param {Type} props.type - The type of documents to display.
 * @returns {JSX.Element} The JSX code for the GridView component.
 */
export default function GridView({ language, type }: Props): JSX.Element {
  const reroute = (url: string) => {
    window.open(url, '_blank')
  }

  const {
    documents,
    selectedDocuments,
    setSelectedDocuments,
    next,
    page,
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
    [selectedDocuments, setSelectedDocuments]
  )

  const authorImage = (author: Author) => {
    switch (author.author_type) {
      case 'STUDENT':
        const student = author as Student
        return student.profile_picture_url + '&w=40'
      case 'COMMITTEE':
        const committee = author as Committee
        return committee.logo_url
      case 'COMMITTEE_POSITION':
        const committeePosition = author as CommitteePosition
        return committeePosition.committee?.logo_url || null
      default:
        throw new Error('Unknown author type')
    }
  }

  const authorName = (author: Author) => {
    switch (author.author_type) {
      case 'STUDENT':
        const student = author as Student
        return student.first_name + ' ' + (student.last_name || '')
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
    <div className='lg:pl-72 px-4 lg:pr-20 mt-4 flex flex-col gap-6 mb-4'>
      <div className='w-full flex flex-wrap gap-4 justify-center sm:justify-start'>
        {documents &&
          documents.length > 0 &&
          documents
            .sort((a, b) =>
              a.is_pinned === b.is_pinned ? 0 : a.is_pinned ? -1 : 1
            )
            .filter(
              (document) =>
                type === 'all' ||
                (type === 'documents' &&
                  document.document_type === 'DOCUMENT') ||
                (type === 'forms' && document.document_type === 'FORM')
            )
            .filter((document) => document.is_pinned)
            .map((document, documentIndex) => {
              return (
                document &&
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
              )
            })}
      </div>
      <Separator />
      <div className='w-full flex flex-wrap gap-4 justify-center sm:justify-start'>
        {documents &&
          documents.length > 0 &&
          documents
            .sort((a, b) =>
              a.is_pinned === b.is_pinned ? 0 : a.is_pinned ? -1 : 1
            )
            .filter(
              (document) =>
                type === 'all' ||
                (type === 'documents' &&
                  document.document_type === 'DOCUMENT') ||
                (type === 'forms' && document.document_type === 'FORM')
            )
            .filter((document) => !document.is_pinned)
            .map((document, documentIndex) => {
              return (
                document &&
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
              )
            })}
      </div>
      {page < total_pages && (
        <Button
          className='w-60 self-center'
          variant={'secondary'}
          onClick={() => next()}
        >
          {t('load_more')}
        </Button>
      )}
    </div>
  )
}

/**
 * @name renderDocuments
 * @description A function that renders a document in the grid view.
 *
 * @param {number} documentIndex - The index of the document in the list.
 * @param {Document[]} selectedDocuments - The list of selected documents.
 * @param {Document} document - The document to render.
 * @param {(event: MouseEvent, document: Document) => void} handleDocumentClick - The function to handle a document click.
 * @param {(event: KeyboardEvent, document: Document) => void} handleDocumentKeydown - The function to handle a document keydown.
 * @param {TFunction} t - The translation function.
 * @param {(author: Author) => string | null | undefined} authorImage - The function to get the author image.
 * @param {(author: Author) => string} authorName - The function to get the author name.
 * @returns {JSX.Element} The JSX code for the document.
 */
function renderDocuments(
  documentIndex: number,
  selectedDocuments: Document[],
  document: Document,
  handleDocumentClick: (event: MouseEvent, document: Document) => void,
  handleDocumentKeydown: (event: KeyboardEvent, document: Document) => void,
  t: TFunction,
  authorImage: (author: Author) => string | null | undefined,
  authorName: (author: Author) => string
): JSX.Element {
  return (
    <div
      key={documentIndex}
      tabIndex={0}
      className={`w-32 md:w-60 h-fit rounded-md border cursor-pointer flex flex-col justify-between
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
      <div className='w-full h-fit flex items-center justify-between py-2 px-1 md:px-4'>
        <div className='flex items-center gap-2 h-10'>
          {document.document_type === 'DOCUMENT' ? (
            <DocumentIcon
              className='w-4 h-4 md:w-5 md:h-5 text-green-500'
              title='Document'
            />
          ) : (
            <DocumentTextIcon
              className='w-5 h-5 text-amber-500'
              title='Document type is a Form'
            />
          )}
          <span className='sr-only'>Document type is a document</span>
          <p className='tracking-wide text-xs md:text-sm max-w-20 md:max-w-44 place-self-center overflow-hidden'>
            {document.translations[0].title}
          </p>
        </div>
      </div>
      {/*<div
        id='preview'
        className='w-full h-full bg-neutral-200 grid place-items-center dark:bg-neutral-700'
      >
        <p className='text-xs select-none uppercase tracking-widest text-center'>
          {t('no_preview')}
        </p>
      </div>*/}
      <div className='w-full h-fit flex items-center py-2 gap-2 bg-neutral-50/5 px-1 md:px-4'>
        <Avatar className='bg-white h-5 md:h-fit w-auto aspect-square grid place-items-center'>
          <AvatarImage
            src={authorImage(document.author) || ''}
            width={40}
            height={40}
            alt={authorName(document.author)}
            loading='lazy'
            fetchPriority='low'
            className='h-5 w-auto md:h-10 aspect-square object-contain p-0.5 rounded-full'
          />
          <AvatarFallback className='bg-white p-1'>
            <Image
              src={FallbackLogo}
              width={40}
              height={40}
              alt={authorName(document.author)}
            />
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <p
            className='text-xs md:text-sm max-w-36 truncate'
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
