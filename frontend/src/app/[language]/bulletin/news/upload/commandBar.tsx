'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DocumentTextIcon, EyeIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import '/node_modules/flag-icons/css/flag-icons.min.css'

export default function CommandBar({ language }: { language: string }) {
  const [title, setTitle] = useState('Untitled Article')

  const languageFlags = new Map([
    ['en', 'gb'],
    ['se', 'se'],
  ])

  const languageNames = new Map([
    ['en', 'English'],
    ['se', 'Svenska'],
  ])

  const getFlagCode = (lang: string) => {
    return languageFlags.get(lang) || 'xx'
  }

  const getLanguageName = (lang: string) => {
    return languageNames.get(lang) || 'Unknown'
  }

  return (
    <div className='w-full h-48 flex flex-col bg-white fixed border-b-2 border-yellow-400 z-30'>
      <div className='h-24 bg-white' />
      <div className='flex justify-between px-6'>
        <div className='w-fit h-24 flex flex-col justify-center'>
          <Breadcrumb className=''>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='#'>Styrelsen</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='#'>Articles</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='#' className='max-w-40 truncate'>
                  {title}
                </BreadcrumbLink>
                <Badge className='ml-2' variant='outline'>
                  Draft
                </Badge>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className='flex items-center mt-2'>
            <div className='flex items-center'>
              <DocumentTextIcon className='w-8 h-8 text-green-600' />
              <Input
                name='title'
                id='title'
                defaultValue={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-96 ml-2'
              />
              <Button size='icon' className='ml-4'>
                <span className={`fi fi-${getFlagCode(language)}`} />
              </Button>
            </div>
          </div>
        </div>
        <div className='flex items-center'>
          <Button
            className='mr-4'
            variant='outline'
            size='icon'
            title='Preview'
            aria-label='Preview'
          >
            <EyeIcon className='w-6 h-6' />
          </Button>
          <Button>Publish</Button>
        </div>
      </div>
    </div>
  )
}
