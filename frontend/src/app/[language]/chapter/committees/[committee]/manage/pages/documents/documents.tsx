'use client'

import DocumentTable from '@/app/[language]/chapter/committees/[committee]/manage/pages/documents/documentTable'
import { useTranslation } from '@/app/i18n/client'
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
import { Skeleton } from '@/components/ui/skeleton'
import Committee from '@/models/Committee'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { useEffect, useState, type JSX } from 'react'

interface Props {
  language: string
  committee: Committee
}

/**
 * @name DocumentPage
 * @description The page for managing a committees documents
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 * @param {Committee} props.committee - The committee data
 *
 * @returns {JSX.Element} The rendered component
 */
export default function DocumentPage({
  language,
  committee,
}: Props): JSX.Element {
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation(language, 'committee_management/documents')
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

  return (
    <section className='grow'>
      <h2 className='text-2xl py-3 border-b-2 border-yellow-400'>
        {t('title')}
      </h2>
      <div className='flex flex-col mt-4'>
        <div className='flex mb-4'>
          <Card className='w-72 relative'>
            <CardHeader>
              <CardTitle>{t('title')}</CardTitle>
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
                  <Button>{t('upload_document')}</Button>
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
        <DocumentTable language={language} committee={committee} />
      </div>
    </section>
  )
}
