'use client'

import {
  PhotoIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import React from 'react'

export default function StaticContent() {
  return (
    <ul className='w-full px-5 pb-4 mt-4 border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300'>
      <li className='w-full h-20 flex justify-between items-center border-b-2 border-black'>
        <div className=''>
          <p>Committee Page</p>

          <Link
            href={'/chapter/committees/styrelsen'}
            className='text-sm text-gray-700 flex items-center hover:underline underline-offset-4 decoration-yellow-400 decoration-2'
            target='_blank'
          >
            <span>./chapter/committees/styrelsen</span>
            <ArrowTopRightOnSquareIcon className='w-5 h-5 ml-2' />
          </Link>
        </div>
        <div className='flex'>
          <div className='flex'>
            <div className='flex'>
              <PhotoIcon className='w-6 h-6 mr-2' />
              <span>2</span>
            </div>
            <div className='flex ml-4'>
              <DocumentTextIcon className='w-6 h-6 mr-2' />
              <span>320</span>
            </div>
          </div>

          <div className='ml-20'>
            <PencilSquareIcon className='w-6 h-6' />
          </div>
        </div>
      </li>
      <li className='w-full h-20 flex justify-between items-center border-b-2 border-black'>
        <div className=''>
          <p>Chapter Page</p>
          <Link
            href={'/chapter#styrelsen'}
            className='text-sm text-gray-700 flex items-center hover:underline underline-offset-4 decoration-yellow-400 decoration-2'
            target='_blank'
          >
            <span>./chapter</span>
            <ArrowTopRightOnSquareIcon className='w-5 h-5 ml-2' />
          </Link>
        </div>
        <div className='flex'>
          <div className='flex'>
            <div className='flex'>
              <PhotoIcon className='w-6 h-6 mr-2' />
              <span>0</span>
            </div>
            <div className='flex ml-4'>
              <DocumentTextIcon className='w-6 h-6 mr-2' />
              <span>180</span>
            </div>
          </div>

          <div className='ml-20'>
            <PencilSquareIcon className='w-6 h-6' />
          </div>
        </div>
      </li>
      <li className='w-full h-20 flex justify-between items-center border-b-2 border-black'>
        <div className=''>
          <p>Popup</p>
        </div>
        <div className='flex'>
          <div className='flex'>
            <div className='flex'>
              <PhotoIcon className='w-6 h-6 mr-2' />
              <span>0</span>
            </div>
            <div className='flex ml-4'>
              <DocumentTextIcon className='w-6 h-6 mr-2' />
              <span>20</span>
            </div>
          </div>

          <div className='ml-20'>
            <PencilSquareIcon className='w-6 h-6' />
          </div>
        </div>
      </li>
    </ul>
  )
}
