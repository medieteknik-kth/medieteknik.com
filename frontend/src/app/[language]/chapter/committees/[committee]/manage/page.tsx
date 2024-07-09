import StyrelsenIcon from 'public/images/committees/styrelsen.png'
import Logo from 'public/images/logo.webp'
import {
  HomeIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  NewspaperIcon,
  GlobeAltIcon,
  PhotoIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ArrowTopRightOnSquareIcon,
  EyeIcon,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GetCommitteePublic, GetCommitteeData } from '@/api/committee'
const HomePage = React.lazy(() => import('./pages/home'))
const MembersPage = React.lazy(() => import('./pages/members'))
const StaticPage = React.lazy(() => import('./pages/static'))
const NewsPage = React.lazy(() => import('./pages/news'))
const EventPage = React.lazy(() => import('./pages/events'))
const DocumentPage = React.lazy(() => import('./pages/documents'))
const ImagePage = React.lazy(() => import('./pages/images'))

export const revalidate = 60 * 60 * 24

export default async function CommitteeManage({
  params: { language, committee },
}: {
  params: { language: string; committee: string }
}) {
  const decodedCommittee = decodeURIComponent(committee)
  const committeeData = await GetCommitteePublic(decodedCommittee, language)
  const committeeDataFull = await GetCommitteeData(decodedCommittee)

  if (!committeeData) {
    return <p>Not Found!</p>
  }

  return (
    <main className='relative'>
      <div className='h-24 bg-black' />
      <Breadcrumb className='w-full h-fit border-b px-4 py-4'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={'/' + language + '/chapter'}>
              Chapter
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={'/' + language + '/chapter/committees'}>
              Committees
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={'/' + language + '/chapter/committees/' + committee}
              className='capitalize'
            >
              {decodedCommittee}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Manage</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='w-full h-fit mt-4'>
        <h1 className='absolute capitalize left-56 top-52 text-3xl'>
          {decodeURIComponent(committee)}
        </h1>
        <Link
          href={`/chapter/committees/${committee}`}
          target='_blank'
          title={
            decodedCommittee.charAt(0).toUpperCase() +
            decodedCommittee.slice(1) +
            ' Page'
          }
          className='w-32 h-32 grid place-items-center absolute top-40 left-20 bg-white rounded-full overflow-hidden'
        >
          <Image
            src={committeeData.logo_url || Logo.src}
            alt={
              decodedCommittee.charAt(0).toUpperCase() +
              decodedCommittee.slice(1) +
              ' Logo'
            }
            width={256}
            height={256}
            className='w-28 h-auto object-cover p-2'
          />
        </Link>
        <div className='flex mb-10 pt-16'>
          <div className='w-full h-fit py-6 flex px-20'>
            <Tabs defaultValue='home' className='w-full h-fit'>
              <TabsList className='h-full flex space-y-1 justify-start ml-36 z-20'>
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
                  value='pages'
                  className='w-36 h-10 flex justify-start items-center'
                >
                  <GlobeAltIcon className='w-6 h-6 mr-2' />
                  <span>Pages</span>
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
                <TabsTrigger
                  value='images'
                  className='w-36 h-10 flex justify-start items-center'
                >
                  <PhotoIcon className='w-6 h-6 mr-2' />
                  <span>Images</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value='home'>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <HomePage language={language} data={committeeDataFull} />
                </React.Suspense>
              </TabsContent>
              <TabsContent value='members'>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <MembersPage data={committeeDataFull} />
                </React.Suspense>
              </TabsContent>
              <TabsContent value='pages'>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <StaticPage language={language} committee={committee} />
                </React.Suspense>
              </TabsContent>
              <TabsContent value='news'>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <NewsPage language={language} data={committeeDataFull} />
                </React.Suspense>
              </TabsContent>
              <TabsContent value='events'>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <EventPage language={language} data={committeeDataFull} />
                </React.Suspense>
              </TabsContent>
              <TabsContent value='documents'>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <DocumentPage language={language} data={committeeDataFull} />
                </React.Suspense>
              </TabsContent>
              <TabsContent value='images'>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <ImagePage language={language} data={committeeDataFull} />
                </React.Suspense>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}
