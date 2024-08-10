'use client'
import { Head } from '@/components/static/Static'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Squares2X2Icon,
  HomeIcon,
  DocumentTextIcon,
  DocumentIcon,
  Bars3Icon,
  EllipsisVerticalIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCallback, useState } from 'react'
import View from './tabs/View'
import useSWR from 'swr'
import Loading from '@/components/tooltips/Loading'
import { API_BASE_URL } from '@/utility/Constants'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { Document } from '@/models/Document'
import { useTranslation } from '@/app/i18n/client'
import DocumentUpload from '@/components/dialogs/DocumentUpload'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type View = 'grid' | 'list'

const fetcher = (url: string) =>
  fetch(url).then((res) => res.json() as Promise<Document[]>)

export default function Documents({
  params: { language },
}: {
  params: { language: string }
}) {
  const [view, setView] = useState<View>('grid')
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [open, setOpen] = useState(false)
  const { permissions, student } = useAuthentication()
  const { t } = useTranslation(language, 'document')
  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/public/documents?language=${language}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      errorRetryCount: 0,
      shouldRetryOnError: false,
    }
  )
  let documents = data

  const addDocument = useCallback(
    (document: Document) => {
      if (!documents) {
        documents = [document]
      } else {
        documents.push(document)
      }
    },
    [documents]
  )

  if (isLoading) return <Loading language={language} />

  const categories = [
    {
      title: t('category.home'),
      icon: <HomeIcon className='w-6 h-6 mr-2' />,
    },
    {
      title: t('category.documents'),
      icon: <DocumentIcon className='w-6 h-6 mr-2 text-green-500' />,
    },
    {
      title: t('category.forms'),
      icon: <DocumentTextIcon className='w-6 h-6 mr-2 text-amber-500' />,
    },
  ]
  return (
    <main>
      <div className='h-24 bg-black' />
      <Head title={t('title')} />
      <Tabs orientation='vertical' defaultValue={t('category.home')}>
        <div className='w-60 absolute h-full left-0 border-r py-3 px-4 flex flex-col gap-4'>
          {student && permissions.author.includes('DOCUMENT') && (
            <>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>Upload Document</Button>
                </DialogTrigger>
                <DocumentUpload
                  language={language}
                  addDocument={addDocument}
                  author={student}
                  closeMenuCallback={() => setOpen(false)}
                />
              </Dialog>
              <Separator className='-my-0.5' />
            </>
          )}

          <div className='flex flex-col gap-2'>
            <h3 className='text-lg font-semibold tracking-wide'>
              {t('categories')}
            </h3>
            <TabsList className='flex flex-col gap-2 h-fit'>
              {categories.map((category, index) => (
                <TabsTrigger asChild key={index} value={category.title}>
                  <Button
                    variant='outline'
                    className='w-full flex justify-start'
                    title={category.title}
                  >
                    {category.icon}
                    <p>{category.title}</p>
                  </Button>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <Separator />
        </div>
        <div className='w-full h-fit border-b ml-60 flex gap-4 items-center px-4 py-3'>
          <div className='w-fit rounded-md border flex items-center gap-1'>
            <Button
              variant={view === 'grid' ? 'default' : 'ghost'}
              size='icon'
              title={t('view.grid')}
              onClick={() => {
                if (view === 'grid') return
                setView('grid')
              }}
            >
              <Squares2X2Icon className='w-6 h-6' />
            </Button>
            <Separator orientation='vertical' className='h-6' />
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size='icon'
              title={t('view.list')}
              onClick={() => {
                if (view === 'list') return
                setView('list')
              }}
            >
              <Bars3Icon className='w-6 h-6' />
            </Button>
          </div>
          {/*
          TODO: Add Search
          <Separator orientation='vertical' className='h-8' />
          <Input type='search' className='w-96' placeholder={t('search')} />*/}
        </div>
        <div className='grow h-12 border-b ml-60 px-4'>
          {selectedDocuments.length > 0 && (
            <div className='h-full flex gap-4 items-center'>
              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  title='Unselect All'
                  onClick={() => setSelectedDocuments([])}
                >
                  <XMarkIcon className='w-6 h-6' />
                </Button>
                <span className='tracking-wide'>
                  {selectedDocuments.length} {t('document_selected')}
                </span>
              </div>
              <Separator orientation='vertical' className='h-6' />
              <div className='flex gap-2'>
                <Button variant='ghost' size='icon' title={t('information')}>
                  <InformationCircleIcon className='w-6 h-6' />
                </Button>
                <Button variant='ghost' size='icon' title={t('share')}>
                  <ArrowTopRightOnSquareIcon className='w-6 h-6' />
                </Button>
                <Button variant='ghost' size='icon' title={t('download')}>
                  <ArrowDownTrayIcon className='w-6 h-6' />
                </Button>
              </div>
              <Separator orientation='vertical' className='h-6' />
              <div className='flex gap-2'>
                {permissions.author.includes('DOCUMENT') &&
                  permissions.student.includes('ITEMS_DELETE') && (
                    <Button
                      variant='destructive'
                      size='icon'
                      title={t('delete')}
                    >
                      <TrashIcon className='w-6 h-6' />
                    </Button>
                  )}
                <Button variant='ghost' size='icon' title={t('more_actions')}>
                  <EllipsisVerticalIcon className='w-6 h-6' />
                </Button>
              </div>
            </div>
          )}
        </div>
        {documents ? (
          <>
            <TabsContent value={t('category.home')}>
              <View
                language={language}
                documents={documents}
                currentView={view}
                selectedDocuments={selectedDocuments}
                setSelectedDocuments={setSelectedDocuments}
              />
            </TabsContent>
            <TabsContent value={t('category.documents')}>
              {documents.length > 0 ? (
                <View
                  language={language}
                  documents={documents.filter(
                    (doc) => doc.document_type === 'DOCUMENT'
                  )}
                  currentView={view}
                  selectedDocuments={selectedDocuments}
                  setSelectedDocuments={setSelectedDocuments}
                />
              ) : (
                <div className='h-[1080px]' />
              )}
            </TabsContent>
            <TabsContent value={t('category.forms')}>
              {documents.length > 0 ? (
                <View
                  language={language}
                  documents={documents.filter(
                    (doc) => doc.document_type === 'FORM'
                  )}
                  currentView={view}
                  selectedDocuments={selectedDocuments}
                  setSelectedDocuments={setSelectedDocuments}
                />
              ) : (
                <div className='h-[1080px]' />
              )}
            </TabsContent>
          </>
        ) : (
          <div className='min-h-[1080px]' />
        )}
      </Tabs>
    </main>
  )
}
