'use client'
import { Head } from '@/components/static/Static'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Squares2X2Icon,
  HomeIcon,
  DocumentTextIcon,
  DocumentIcon,
  AdjustmentsHorizontalIcon,
  Bars3Icon,
  EllipsisVerticalIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import View from './tabs/View'
import useSWR from 'swr'
import Loading from '@/components/tooltips/Loading'
import { API_BASE_URL } from '@/utility/Constants'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import UploadDocument from './upload'
import { DocumentPagination } from '@/models/Pagination'

type View = 'grid' | 'list'

const fetcher = (url: string) =>
  fetch(url).then((res) => res.json() as Promise<DocumentPagination>)

export default function Documents({
  params: { language },
}: {
  params: { language: string }
}) {
  const [view, setView] = useState<View>('grid')
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const { permissions } = useAuthentication()
  const {
    data: documents,
    error,
    isLoading,
  } = useSWR(`${API_BASE_URL}/public/documents?language=${language}`, fetcher)

  if (isLoading) return <Loading language={language} />

  const categories = [
    {
      title: 'Home',
      icon: <HomeIcon className='w-6 h-6 mr-2' />,
    },
    {
      title: 'Documents',
      icon: <DocumentIcon className='w-6 h-6 mr-2 text-green-500' />,
    },
    {
      title: 'Forms',
      icon: <DocumentTextIcon className='w-6 h-6 mr-2 text-amber-500' />,
    },
  ]
  return (
    <main>
      <div className='h-24 bg-black' />
      <Head title='Documents' />
      <Tabs orientation='vertical' defaultValue='Home'>
        <div className='w-60 absolute h-full left-0 border-r py-3 px-4 flex flex-col gap-4'>
          {permissions.author.includes('DOCUMENT') && (
            <div className='flex flex-col gap-4'>
              <UploadDocument language={language} />
              <Separator className='-my-0.5' />
            </div>
          )}

          <div className='flex flex-col gap-2'>
            <h3 className='text-lg font-semibold tracking-wide'>Categories</h3>
            <TabsList className='flex flex-col gap-2 h-fit'>
              {categories.map((category, index) => (
                <TabsTrigger asChild key={index} value={category.title}>
                  <Button
                    variant='outline'
                    className='w-full flex justify-start'
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
              onClick={() => {
                if (view === 'list') return
                setView('list')
              }}
            >
              <Bars3Icon className='w-6 h-6' />
            </Button>
          </div>
          <Separator orientation='vertical' className='h-8' />
          <Button variant='outline'>
            <AdjustmentsHorizontalIcon className='w-6 h-6 mr-2' />
            <p>Filters</p>
          </Button>
          <Separator orientation='vertical' className='h-8' />
          <Input type='search' className='w-96' placeholder='Search' />
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
                  {selectedDocuments.length} selected
                </span>
              </div>
              <Separator orientation='vertical' className='h-6' />
              <div className='flex gap-2'>
                <Button variant='ghost' size='icon' title='Information'>
                  <InformationCircleIcon className='w-6 h-6' />
                </Button>
                <Button variant='ghost' size='icon' title='Share'>
                  <ArrowTopRightOnSquareIcon className='w-6 h-6' />
                </Button>
                <Button variant='ghost' size='icon' title='Download'>
                  <ArrowDownTrayIcon className='w-6 h-6' />
                </Button>
              </div>
              <Separator orientation='vertical' className='h-6' />
              <div className='flex gap-2'>
                {permissions.author.includes('DOCUMENT') &&
                  permissions.student.includes('ITEMS_DELETE') && (
                    <Button variant='destructive' size='icon' title='Delete'>
                      <TrashIcon className='w-6 h-6' />
                    </Button>
                  )}
                <Button variant='ghost' size='icon' title='More Actions'>
                  <EllipsisVerticalIcon className='w-6 h-6' />
                </Button>
              </div>
            </div>
          )}
        </div>
        {documents ? (
          <>
            <TabsContent value='Home'>
              <View
                language={language}
                documents={documents.items}
                currentView={view}
                selectedDocuments={selectedDocuments}
                setSelectedDocuments={setSelectedDocuments}
              />
            </TabsContent>
            <TabsContent value='Documents'>
              {documents.items.length > 0 ? (
                <View
                  language={language}
                  documents={documents.items.filter(
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
            <TabsContent value='Forms'>
              {documents.items.length > 0 ? (
                <View
                  language={language}
                  documents={documents.items.filter(
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
