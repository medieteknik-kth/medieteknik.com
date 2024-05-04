import StyrelsenIcon from 'public/images/committees/styrelsen.png'

import {
  HomeIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  NewspaperIcon,
  PhotoIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ArrowTopRightOnSquareIcon,
  EyeIcon,
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

const StaticPage = React.lazy(() => import('./pages/static'))

export default function CommitteeManage({
  params: { language, committee },
}: {
  params: { language: string; committee: string }
}) {
  return (
    <main className='relative'>
      <div className='h-24 bg-black' />
      <Breadcrumb className='w-fit h-fit absolute top-28 left-4'>
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
              {committee}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Manage</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='w-full h-fit mt-10'>
        <div className='w-full h-56 flex items-center px-40 mt-10'>
          <div className='w-48 h-48 rounded-full shadow-md shadow-gray-300 mb-4 grid place-items-center'>
            <Link
              href={'/chapter/committees/styrelsen'}
              target='_blank'
              title='Styrelsen'
              className='grid place-items-center'
            >
              <Image
                src={StyrelsenIcon}
                alt='Styrelsen'
                width={192}
                height={192}
                className='rounded-full w-11/12 h-auto'
              />
            </Link>
          </div>
          <div className='w-fit h-full ml-6 flex flex-col justify-center'>
            <h1 className='text-3xl uppercase'>{committee}</h1>
            <span>Public Committee</span>
          </div>
        </div>
        <div className='flex mb-10'>
          <div className='w-96 h-[550px] ml-20 border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300'>
            <ul className='w-full px-20 grid grid-cols-1 gap-8 mt-8 text-lg'>
              <li className='h-12 px-4 py-2 flex items-center border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300'>
                <HomeIcon className='w-6 h-6' />
                <span className='ml-2'>Home</span>
              </li>
              <li className='h-12 px-4 py-2 flex items-center border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300'>
                <UserGroupIcon className='w-6 h-6' />
                <span className='ml-2'>Members</span>
              </li>
              <li className='h-12 px-4 py-2 flex items-center border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300'>
                <DocumentDuplicateIcon className='w-6 h-6' />
                <span className='ml-2'>Items</span>
              </li>
              <li className='h-12 px-4 py-2 flex items-center border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300'>
                <NewspaperIcon className='w-6 h-6' />
                <span className='ml-2'>Pages</span>
              </li>
            </ul>
          </div>
          <StaticPage params={{ language }} />
        </div>
      </div>
    </main>
  )
}
