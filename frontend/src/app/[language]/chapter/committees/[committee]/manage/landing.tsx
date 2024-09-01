import Logo from 'public/images/logo.webp'
import {
  HomeIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  NewspaperIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Content from './content'
import EditCommittee from './edit'
import Committee from '@/models/Committee'

interface Props {
  language: string
  committeeData: Committee
  committeeName: string
}

export default function CommitteeLandingPage({
  language,
  committeeData,
  committeeName,
}: Props) {
  return (
    <>
      <div className='h-24 bg-black' />
      <Breadcrumb className='w-full h-fit border-b px-4 py-2'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={'/' + language + '/chapter'} className='py-2'>
              Chapter
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={'/' + language + '/chapter/committees'}
              className='py-2'
            >
              Committees
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={'/' + language + '/chapter/committees/' + committeeName}
              className='capitalize py-2'
            >
              {committeeName}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Manage</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='w-full h-fit mt-32 relative'>
        <div className='flex items-center absolute left-16 gap-8 -top-28'>
          <Link
            href={`/chapter/committees/${committeeName}`}
            target='_blank'
            title={
              committeeName.charAt(0).toUpperCase() +
              committeeName.slice(1) +
              ' Page'
            }
            className='w-32 h-32 grid place-items-center bg-white rounded-full overflow-hidden hover:scale-110 transition-transform'
          >
            <Image
              src={committeeData.logo_url || Logo.src}
              alt={
                committeeName.charAt(0).toUpperCase() +
                committeeName.slice(1) +
                ' Logo'
              }
              width={256}
              height={256}
              priority
              loading='eager'
              className='w-28 h-auto object-cover p-2'
            />
          </Link>
          <h1 className='capitalize tracking-wide text-3xl'>
            {decodeURIComponent(committeeName)}
          </h1>
          <EditCommittee committee={committeeData} language={language} />
        </div>
        <div className='flex mb-10 mt-16'>
          <div className='w-full h-fit flex px-20'>
            <Tabs defaultValue='home' className='w-full h-fit mt-8'>
              <TabsList className='h-fit flex space-x-1 justify-start ml-36 z-30 absolute -top-4'>
                <TabsTrigger
                  value='home'
                  className='w-36 h-10 flex justify-start items-center'
                >
                  <HomeIcon className='w-6 h-6 mr-2' />
                  <span>Home</span>
                </TabsTrigger>
                <TabsTrigger
                  value='members'
                  className='w-36 h-10 flex justify-start items-center'
                >
                  <UserGroupIcon className='w-6 h-6 mr-2' />

                  <span>Members</span>
                </TabsTrigger>
                <TabsTrigger
                  value='news'
                  className='w-36 h-10 flex justify-start items-center'
                >
                  <NewspaperIcon className='w-6 h-6 mr-2' />
                  <span>News</span>
                </TabsTrigger>
                <TabsTrigger
                  value='events'
                  className='w-36 h-10 flex justify-start items-center'
                >
                  <CalendarDaysIcon className='w-6 h-6 mr-2' />
                  <span>Events</span>
                </TabsTrigger>
                <TabsTrigger
                  value='documents'
                  className='w-36 h-10 flex justify-start items-center'
                >
                  <DocumentDuplicateIcon className='w-6 h-6 mr-2' />
                  <span>Documents</span>
                </TabsTrigger>
              </TabsList>
              <Content language={language} committee={committeeData} />
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}
