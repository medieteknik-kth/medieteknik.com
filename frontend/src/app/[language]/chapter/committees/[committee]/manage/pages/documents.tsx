'use client'
import DocumentUpload from '@/components/dialogs/DocumentUpload'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Committee from '@/models/Committee'
import { DocumentPagination } from '@/models/Pagination'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import { API_BASE_URL } from '@/utility/Constants'
import {
  ArrowUpTrayIcon,
  CheckBadgeIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useState, type JSX } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) =>
  fetch(url, {
    credentials: 'include',
    cache: 'force-cache',
  }).then((res) => res.json() as Promise<DocumentPagination>)

/**
 * @name DocumentPage
 * @description The page for managing a committees documents
 *
 * @param {string} language - The language of the page
 * @param {Committee} committee - The committee to manage
 * @returns {JSX.Element} The rendered component
 */
export default function DocumentPage({
  language,
  committee,
}: {
  language: string
  committee: Committee
}): JSX.Element {
  const [isLoading, setIsLoading] = useState(true)
  const [pageIndex, setPageIndex] = useState(1)
  const { data: documents, error: swrError } = useSWR<DocumentPagination>(
    `${API_BASE_URL}/committees/${committee.translations[0].title.toLowerCase()}/documents?language=${language}&page=${pageIndex}`,
    fetcher
  )
  const {
    total_documents,
    isLoading: isLoadingDocuments,
    setDocumentsTotal,
  } = useCommitteeManagement()
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    if (!isLoadingDocuments) {
      setIsLoading(false)
    }
  }, [isLoadingDocuments])

  if (swrError) {
    console.error(swrError)
    return <p>{swrError.message}</p>
  }

  if (!documents) {
    return <p>Loading...</p>
  }

  return (
    <section className='grow'>
      <h2 className='text-2xl py-3 border-b-2 border-yellow-400'>Documents</h2>
      <div className='flex flex-col mt-4'>
        <div className='flex mb-4'>
          <Card className='w-72 relative'>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                <ArrowUpTrayIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Amount of Uploaded Documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className='w-32 h-8' />
              ) : (
                <p className='text-2xl'>{total_documents}</p>
              )}
            </CardContent>
            <CardFooter>
              <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogTrigger asChild>
                  <Button>Upload Document</Button>
                </DialogTrigger>
                <DocumentUpload
                  language={language}
                  author={committee}
                  addDocument={() => setDocumentsTotal(total_documents + 1)}
                  closeMenuCallback={() => setOpenModal(false)}
                />
              </Dialog>
            </CardFooter>
          </Card>
        </div>
        <Card className='relative'>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              <DocumentDuplicateIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
              All Documents (20 per page)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='w-fit mb-4'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href='#'
                      onClick={() =>
                        setPageIndex((prev) => {
                          if (prev > 0) {
                            return prev - 1
                          }
                          return prev
                        })
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: documents.total_pages }, (_, i) => (
                    <PaginationItem key={i} onClick={() => setPageIndex(i)}>
                      <PaginationLink href='#' isActive={pageIndex === i}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href='#'
                      onClick={() =>
                        setPageIndex((prev) => {
                          if (prev < documents.total_pages - 1) {
                            return prev + 1
                          }
                          return prev
                        })
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='max-w-52'>Title</TableHead>
                  <TableHead className='w-12'>Public</TableHead>
                  <TableHead className='text-right w-48'>Actions</TableHead>
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
                    <TableCell>
                      <Button size={'icon'} variant={'destructive'}>
                        <TrashIcon className='w-5 h-5' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
