'use client'
import { Section } from '@/components/static/Static'
import { useState } from 'react'

import {
  EnvelopeIcon,
  CalendarIcon,
  DocumentTextIcon,
  PhotoIcon,
  EyeIcon,
  LinkIcon,
  PencilSquareIcon,
  TrashIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

export default function ItemsPage() {
  const [display, setDisplay] = useState('card')
  return (
    <section className='grow h-full relative dark:bg-[#111]'>
      <div className='w-full flex items-center justify-center border-b-2 border-yellow-400'>
        <h1 className='text-2xl py-4'>Items</h1>
      </div>
      <Section centeredChildren>
        <div className='w-1/4 h-fit grid grid-cols-4 auto-rows-max gap-2 my-10 place-items-center *:w-20 *:h-20'>
          <div className='border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 relative hover:bg-black/15 hover:cursor-pointer z-20'>
            <EnvelopeIcon className='w-12 h-12 absolute top-0 bottom-0 left-0 right-0 m-auto text-green-600' />
            <p className='w-fit absolute -bottom-8 left-0 right-0 mx-auto text-lg font-bold z-20'>
              News
            </p>
          </div>
          <div className='border-2 border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 relative hover:bg-black/15 hover:cursor-pointer'>
            <CalendarIcon className='w-12 h-12 absolute top-0 bottom-0 left-0 right-0 m-auto text-yellow-600' />
            <p className='w-fit absolute -bottom-8 left-0 right-0 mx-auto text-lg font-bold'>
              Events
            </p>
          </div>
          <div className='border-2 border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 relative hover:bg-black/15 hover:cursor-pointer'>
            <DocumentTextIcon className='w-12 h-12 absolute top-0 bottom-0 left-0 right-0 m-auto text-red-600' />
            <p className='w-fit absolute -bottom-8 -left-2 text-lg font-bold'>
              Documents
            </p>
          </div>

          <div className='border-2 border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 relative hover:bg-black/15 hover:cursor-pointer'>
            <PhotoIcon className='w-12 h-12 absolute top-0 bottom-0 left-0 right-0 m-auto text-blue-600' />
            <p className='w-fit absolute -bottom-8 left-2 text-lg font-bold'>
              Images
            </p>
          </div>
        </div>
      </Section>
      <div className='w-full h-auto grow px-[500px]'>
        <div className='py-4 -ml-4 mb-4 border-b-2 border-yellow-400 flex justify-between items-center'>
          <h2 className='text-xl font-bold'>News</h2>
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex items-center'>
              <p>Filters</p>
              <AdjustmentsHorizontalIcon className='w-6 h-6 ml-2' />
            </div>
            <div className='flex items-center'>
              <p>Sort By</p>
              <ChartBarIcon className='w-6 h-6 ml-2' />
            </div>
          </div>
        </div>
        <ul className='w-full max-h-[748px] overflow-auto grid grid-cols-1 gap-3'>
          <li className='w-full h-16 border-2 border-dashed border-gray-300 bg-white rounded-xl flex items-center pl-4 pr-8'>
            <div className='w-8 h-8 grid place-items-center border-2 border-black rounded-full mr-4'>
              <PlusIcon className='w-6 h-6' />
            </div>
            <h3 className='text-lg font-bold'>Upload</h3>
          </li>
          <li className='w-full h-16 border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 flex justify-between items-center pl-4 pr-8'>
            <h3 className='text-lg font-bold'>News 1</h3>
            <div className='grid grid-cols-4 gap-4'>
              <EyeIcon className='w-6 h-6' />
              <LinkIcon className='w-6 h-6' />
              <PencilSquareIcon className='w-6 h-6' />
              <TrashIcon className='w-6 h-6 text-red-600' />
            </div>
          </li>
          <li className='w-full h-16 border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 flex justify-between items-center pl-4 pr-8'>
            <h3 className='text-lg font-bold'>News 2</h3>
            <div className='grid grid-cols-4 gap-4'>
              <EyeIcon className='w-6 h-6' />
              <LinkIcon className='w-6 h-6' />
              <PencilSquareIcon className='w-6 h-6' />
              <TrashIcon className='w-6 h-6 text-red-600' />
            </div>
          </li>
          <li className='w-full h-16 border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 flex justify-between items-center pl-4 pr-8'>
            <h3 className='text-lg font-bold'>News 3</h3>
            <div className='grid grid-cols-4 gap-4'>
              <EyeIcon className='w-6 h-6' />
              <LinkIcon className='w-6 h-6' />
              <PencilSquareIcon className='w-6 h-6' />
              <TrashIcon className='w-6 h-6 text-red-600' />
            </div>
          </li>
          <li className='w-full h-16 border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 flex justify-between items-center pl-4 pr-8'>
            <h3 className='text-lg font-bold'>News 4</h3>
            <div className='grid grid-cols-4 gap-4'>
              <EyeIcon className='w-6 h-6' />
              <LinkIcon className='w-6 h-6' />
              <PencilSquareIcon className='w-6 h-6' />
              <TrashIcon className='w-6 h-6 text-red-600' />
            </div>
          </li>
          <li className='w-full h-16 border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 flex justify-between items-center pl-4 pr-8'>
            <h3 className='text-lg font-bold'>News 5</h3>
            <div className='grid grid-cols-4 gap-4'>
              <EyeIcon className='w-6 h-6' />
              <LinkIcon className='w-6 h-6' />
              <PencilSquareIcon className='w-6 h-6' />
              <TrashIcon className='w-6 h-6 text-red-600' />
            </div>
          </li>
          <li className='w-full h-16 border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 flex justify-between items-center pl-4 pr-8'>
            <h3 className='text-lg font-bold'>News 6</h3>
            <div className='grid grid-cols-4 gap-4'>
              <EyeIcon className='w-6 h-6' />
              <LinkIcon className='w-6 h-6' />
              <PencilSquareIcon className='w-6 h-6' />
              <TrashIcon className='w-6 h-6 text-red-600' />
            </div>
          </li>
          <li className='w-full h-16 border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 flex justify-between items-center pl-4 pr-8'>
            <h3 className='text-lg font-bold'>News 7</h3>
            <div className='grid grid-cols-4 gap-4'>
              <EyeIcon className='w-6 h-6' />
              <LinkIcon className='w-6 h-6' />
              <PencilSquareIcon className='w-6 h-6' />
              <TrashIcon className='w-6 h-6 text-red-600' />
            </div>
          </li>
          <li className='w-full h-16 border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 flex justify-between items-center pl-4 pr-8'>
            <h3 className='text-lg font-bold'>News 8</h3>
            <div className='grid grid-cols-4 gap-4'>
              <EyeIcon className='w-6 h-6' />
              <LinkIcon className='w-6 h-6' />
              <PencilSquareIcon className='w-6 h-6' />
              <TrashIcon className='w-6 h-6 text-red-600' />
            </div>
          </li>
          <li className='w-full h-16 border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 flex justify-between items-center pl-4 pr-8'>
            <h3 className='text-lg font-bold'>News 9</h3>
            <div className='grid grid-cols-4 gap-4'>
              <EyeIcon className='w-6 h-6' />
              <LinkIcon className='w-6 h-6' />
              <PencilSquareIcon className='w-6 h-6' />
              <TrashIcon className='w-6 h-6 text-red-600' />
            </div>
          </li>
          <li className='w-full h-16 border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 flex justify-between items-center pl-4 pr-8'>
            <h3 className='text-lg font-bold'>News 10</h3>
            <div className='grid grid-cols-4 gap-4'>
              <EyeIcon className='w-6 h-6' />
              <LinkIcon className='w-6 h-6' />
              <PencilSquareIcon className='w-6 h-6' />
              <TrashIcon className='w-6 h-6 text-red-600' />
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}
