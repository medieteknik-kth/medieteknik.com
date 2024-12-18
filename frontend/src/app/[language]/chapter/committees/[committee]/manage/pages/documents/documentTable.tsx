'use client'

import { useTranslation } from '@/app/i18n/client'
import Loading from '@/components/tooltips/Loading'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Committee from '@/models/Committee'
import { LanguageCode } from '@/models/Language'
import { DocumentPagination } from '@/models/Pagination'
import { API_BASE_URL } from '@/utility/Constants'
import {
  CheckBadgeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudArrowUpIcon,
  DocumentDuplicateIcon,
  LockClosedIcon,
  LockOpenIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { GB, SE } from 'country-flag-icons/react/3x2'
import Link from 'next/link'
import { JSX, useEffect, useState } from 'react'
import useSWR from 'swr'

interface Props {
  language: LanguageCode
  committee: Committee
}

const fetcher = (url: string) =>
  fetch(url, {
    credentials: 'include',
  }).then((res) => res.json() as Promise<DocumentPagination>)

/**
 * @name DocumentTable
 * @description The table for displaying a committee's documents
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 * @param {Committee} props.committee - The committee data
 *
 * @returns {JSX.Element} The rendered component
 */
export default function DocumentTable({
  language,
  committee,
}: Props): JSX.Element {
  const [pageIndex, setPageIndex] = useState(1)
  const { t } = useTranslation(language, 'committee_management/documents')
  const { data: documents, error: swrError } = useSWR<DocumentPagination>(
    `${API_BASE_URL}/committees/${committee.translations[0].title.toLowerCase()}/documents?page=${pageIndex}`,
    fetcher
  )
  const [temporaryPinned, setTemporaryPinned] = useState<string[]>([])

  useEffect(() => {
    if (!documents) return
    setTemporaryPinned(
      documents.items
        .filter((document) => document.is_pinned)
        .map((document) => document.document_id)
    )
  }, [documents, pageIndex])

  if (swrError) {
    console.error(swrError)
    return <p>{swrError.message}</p>
  }

  if (!documents) {
    return <Loading language={language} />
  }

  const pinDocument = async (documentId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/documents/${documentId}/pin`,
        {
          method: 'PUT',
          credentials: 'include',
        }
      )
      if (response.ok) {
        setTemporaryPinned((prev) => {
          if (prev.includes(documentId)) {
            return prev.filter((id) => id !== documentId)
          }
          return [...prev, documentId]
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const deleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Card className='relative'>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          <DocumentDuplicateIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
          {t('all_documents')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='w-fit mb-4'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  className='w-10 h-10'
                  size={'icon'}
                  disabled={pageIndex === 1}
                  onClick={() => {
                    setPageIndex((prev) => (prev - 1 > 0 ? prev - 1 : 1))
                  }}
                >
                  <ChevronLeftIcon className='w-6 h-6' />
                </Button>
              </PaginationItem>
              {Array.from(
                { length: documents.total_pages ? documents.total_pages : 1 },
                (_, i) => i + 1
              ).map((page) => (
                <PaginationItem key={page}>
                  <Button
                    variant='ghost'
                    className='w-10 h-10'
                    size={'icon'}
                    disabled={pageIndex === page}
                    onClick={() => setPageIndex(page)}
                  >
                    {page}
                  </Button>
                </PaginationItem>
              ))}
              <PaginationItem>
                <Button
                  className='w-10 h-10'
                  size={'icon'}
                  disabled={
                    pageIndex === documents.total_pages ||
                    !documents.total_pages
                  }
                  onClick={() => {
                    setPageIndex((prev) =>
                      prev + 1 > documents.total_pages
                        ? documents.total_pages
                        : prev + 1
                    )
                  }}
                >
                  <ChevronRightIcon className='w-6 h-6' />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='max-w-52'>{t('table.title')}</TableHead>
              <TableHead className='w-12'>{t('table.is_public')}</TableHead>
              <TableHead className='text-right w-48'>
                {t('table.actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.items.map((document, index) => (
              <TableRow key={index}>
                <TableCell>{document.translations[0].title}</TableCell>
                <TableCell>
                  {document.is_public && (
                    <CheckBadgeIcon className='w-5 h-5 text-green-600' />
                  )}
                </TableCell>
                <TableCell className='flex gap-2 items-center justify-end'>
                  <Button
                    size={'icon'}
                    variant={'secondary'}
                    className={`relative ${
                      document.translations.find(
                        (t) => t.language_code === 'sv-SE'
                      )
                        ? ''
                        : 'hidden'
                    }`}
                    asChild
                  >
                    <Link
                      title={t('open_document')}
                      href={
                        document.translations.find(
                          (t) => t.language_code === 'sv-SE'
                        )?.url || ''
                      }
                    >
                      <CloudArrowUpIcon className='w-5 h-5' />
                      <SE title='GB' className='absolute bottom-0 w-3 h-3' />
                    </Link>
                  </Button>
                  <Button
                    size={'icon'}
                    variant={'secondary'}
                    className={`relative ${
                      document.translations.find(
                        (t) => t.language_code === 'en-GB'
                      )
                        ? ''
                        : 'hidden'
                    }`}
                    asChild
                  >
                    <Link
                      title={t('open_document')}
                      href={
                        document.translations.find(
                          (t) => t.language_code === 'en-GB'
                        )?.url || ''
                      }
                    >
                      <CloudArrowUpIcon className='w-5 h-5' />
                      <GB className='absolute bottom-0 w-3 h-3' />
                    </Link>
                  </Button>
                  <Button
                    size={'icon'}
                    variant={'secondary'}
                    title={t('pin_unpin')}
                    disabled={committee.translations[0].title !== 'Styrelsen'}
                    onClick={() => {
                      pinDocument(document.document_id)
                    }}
                  >
                    {temporaryPinned.includes(document.document_id) ? (
                      <LockClosedIcon className='w-5 h-5' />
                    ) : (
                      <LockOpenIcon className='w-5 h-5' />
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size={'icon'}
                        variant={'destructive'}
                        title={t('delete_document')}
                      >
                        <TrashIcon className='w-5 h-5' />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t('delete_document.confirmation')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('delete_document.warning')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {t('delete_document.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            deleteDocument(document.document_id)
                          }}
                        >
                          {t('delete_document')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
