'use client'
import { Head, Section } from '@/components/static/Static'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  ViewColumnsIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
  ChartPieIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  CogIcon,
  BuildingOfficeIcon,
  PlusIcon,
  HomeIcon,
  DocumentTextIcon,
  DocumentIcon,
  AdjustmentsHorizontalIcon,
  Bars3Icon,
  EllipsisVerticalIcon,
  XMarkIcon,
  ArrowUpOnSquareIcon,
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import GridView from './views/GridView'
import ListView from './views/ListView'
import { Document } from '@/models/Document'

type View = 'grid' | 'list'

export default function Documents({
  params: { language },
}: {
  params: { language: string }
}) {
  const [view, setView] = useState<View>('grid')
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])

  const documents: Document[] = [
    {
      author: {
        author_type: 'STUDENT',
        email: 'andree4@kth.se',
        first_name: 'André',
        last_name: 'Eriksson',
        student_type: 'MEDIETEKNIK',
      },
      created_at: new Date('August 20 2023').toLocaleDateString(),
      is_pinned: false,
      is_public: true,
      published_status: 'PUBLISHED',
      translations: [
        {
          title: 'Test Docuement',
          language_code: 'sv',
        },
      ],
      type: 'DOCUMENT',
      url: 'https://storage.googleapis.com/medieteknik-static/documents/2024/6/13/Handlingar%20Styrelsem%C3%B6te%202024-06-13.pdf',
    },
    {
      author: {
        author_type: 'STUDENT',
        email: 'andree4@kth.se',
        first_name: 'André',
        last_name: 'Eriksson',
        student_type: 'MEDIETEKNIK',
      },
      created_at: new Date('August 20 2023').toLocaleDateString(),
      is_pinned: false,
      is_public: true,
      published_status: 'PUBLISHED',
      translations: [
        {
          title: 'Test Form',
          language_code: 'sv',
        },
      ],
      type: 'FORM',
      url: 'https://storage.googleapis.com/medieteknik-static/documents/2024/6/13/Verksamhetsplan%202024/2025.pdf',
    },
    {
      author: {
        author_type: 'STUDENT',
        email: 'andree4@kth.se',
        first_name: 'André',
        last_name: 'Eriksson',
        student_type: 'MEDIETEKNIK',
      },
      created_at: new Date('August 20 2023').toLocaleDateString(),
      is_pinned: false,
      is_public: true,
      published_status: 'PUBLISHED',
      translations: [
        {
          title: 'Test Form',
          language_code: 'sv',
        },
      ],
      type: 'FORM',
      url: 'https://storage.googleapis.com/medieteknik-static/documents/2024/6/13/Verksamhetsplan%202024/2025.pdf',
    },
    {
      author: {
        author_type: 'STUDENT',
        email: 'andree4@kth.se',
        first_name: 'André',
        last_name: 'Eriksson',
        student_type: 'MEDIETEKNIK',
      },
      created_at: new Date('August 20 2023').toLocaleDateString(),
      is_pinned: false,
      is_public: true,
      published_status: 'PUBLISHED',
      translations: [
        {
          title: 'Test Form',
          language_code: 'sv',
        },
      ],
      type: 'FORM',
      url: 'https://storage.googleapis.com/medieteknik-static/documents/2024/6/13/Verksamhetsplan%202024/2025.pdf',
    },
    {
      author: {
        author_type: 'STUDENT',
        email: 'andree4@kth.se',
        first_name: 'André',
        last_name: 'Eriksson',
        student_type: 'MEDIETEKNIK',
      },
      created_at: new Date('August 20 2023').toLocaleDateString(),
      is_pinned: false,
      is_public: true,
      published_status: 'PUBLISHED',
      translations: [
        {
          title: 'Test Form',
          language_code: 'sv',
        },
      ],
      type: 'FORM',
      url: 'https://storage.googleapis.com/medieteknik-static/documents/2024/6/13/Verksamhetsplan%202024/2025.pdf',
    },
    {
      author: {
        author_type: 'STUDENT',
        email: 'andree4@kth.se',
        first_name: 'André',
        last_name: 'Eriksson',
        student_type: 'MEDIETEKNIK',
      },
      created_at: new Date('August 20 2023').toLocaleDateString(),
      is_pinned: false,
      is_public: true,
      published_status: 'PUBLISHED',
      translations: [
        {
          title: 'Test Form',
          language_code: 'sv',
        },
      ],
      type: 'FORM',
      url: 'https://storage.googleapis.com/medieteknik-static/documents/2024/6/13/Verksamhetsplan%202024/2025.pdf',
    },
    {
      author: {
        author_type: 'STUDENT',
        email: 'andree4@kth.se',
        first_name: 'André',
        last_name: 'Eriksson',
        student_type: 'MEDIETEKNIK',
      },
      created_at: new Date('August 20 2023').toLocaleDateString(),
      is_pinned: false,
      is_public: true,
      published_status: 'PUBLISHED',
      translations: [
        {
          title: 'Test Form',
          language_code: 'sv',
        },
      ],
      type: 'FORM',
      url: 'https://storage.googleapis.com/medieteknik-static/documents/2024/6/13/Verksamhetsplan%202024/2025.pdf',
    },
    {
      author: {
        author_type: 'STUDENT',
        email: 'andree4@kth.se',
        first_name: 'André',
        last_name: 'Eriksson',
        student_type: 'MEDIETEKNIK',
      },
      created_at: new Date('August 20 2023').toLocaleDateString(),
      is_pinned: false,
      is_public: true,
      published_status: 'PUBLISHED',
      translations: [
        {
          title: 'Test Form',
          language_code: 'sv',
        },
      ],
      type: 'FORM',
      url: 'https://storage.googleapis.com/medieteknik-static/documents/2024/6/13/Verksamhetsplan%202024/2025.pdf',
    },

    {
      author: {
        author_type: 'STUDENT',
        email: 'andree4@kth.se',
        first_name: 'André',
        last_name: 'Eriksson',
        student_type: 'MEDIETEKNIK',
      },
      created_at: new Date('August 20 2023').toLocaleDateString(),
      is_pinned: false,
      is_public: true,
      published_status: 'PUBLISHED',
      translations: [
        {
          title: 'Test Form',
          language_code: 'sv',
        },
      ],
      type: 'FORM',
      url: 'https://storage.googleapis.com/medieteknik-static/documents/2024/6/13/Verksamhetsplan%202024/2025.pdf',
    },
  ]
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
      <div className='w-60 absolute h-full left-0 border-r py-3 px-4 flex flex-col gap-4'>
        <Button>
          <PlusIcon className='w-6 h-6 mr-2' />
          <p>New</p>
          <span className='sr-only'>Add Document</span>
        </Button>
        <Separator />
        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-semibold tracking-wide'>Categories</h3>
          {categories.map((category, index) => (
            <Button
              key={index}
              variant='outline'
              className='flex justify-start'
            >
              {category.icon}
              <p>{category.title}</p>
            </Button>
          ))}
        </div>
        <Separator />
      </div>
      <div className='grow h-16 border-b ml-60 flex gap-4 items-center px-4'>
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
              <Button variant='destructive' size='icon' title='Delete'>
                <TrashIcon className='w-6 h-6' />
              </Button>
              <Button variant='ghost' size='icon' title='More Actions'>
                <EllipsisVerticalIcon className='w-6 h-6' />
              </Button>
            </div>
          </div>
        )}
      </div>
      <div
        className='h-[1080px]'
        onClick={() => {
          setSelectedDocuments([])
        }}
      >
        {view === 'grid' ? (
          <GridView
            documents={documents}
            selectedDocuments={selectedDocuments}
            setSelectedDocuments={setSelectedDocuments}
            language={language}
          />
        ) : (
          <ListView
            documents={documents}
            selectedDocuments={selectedDocuments}
            setSelectedDocuments={setSelectedDocuments}
            language={language}
          />
        )}
      </div>
    </main>
  )
}
