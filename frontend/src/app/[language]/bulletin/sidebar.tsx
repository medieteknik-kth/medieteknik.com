'use client'
import { Event } from './events'
import { useState } from 'react'

import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'

export default function EventSidebar({
  params: { language, nonHighlightedEvents },
}: {
  params: { language: string; nonHighlightedEvents: Event[] }
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [filteredEvents, setFilteredEvents] =
    useState<Event[]>(nonHighlightedEvents)
  const filters = [
    {
      title: 'Category',
      options: ['Administrative', 'Social', 'Educational'],
      type: 'checkbox',
    },
    {
      title: 'Date Range',
      options: ['Date'],
      type: 'range',
    },
  ]

  return (
    <div className='min-w-96 w-1/4 h-full relative bg-[#111] rounded-r-xl'>
      <div className='w-4/5 h-28 mt-10 m-auto flex flex-col justify-around items-center pb-4 border-b-2 border-white'>
        <div className='w-full h-1/2 flex items-center justify-around'>
          <input
            type='search'
            name='search'
            className='w-4/5 h-full pl-2 bg-white rounded-lg'
            placeholder='Search for Events'
          />
          <button
            type='submit'
            className='w-fit h-fit px-2 py-2 bg-inherit border-2 border-yellow-400/50 hover:bg-white/25 rounded-lg text-white'
            title='Search for events'
            aria-label='Search for events'
          >
            <MagnifyingGlassIcon className='w-6 h-6' />
          </button>
        </div>
        <div className='w-full flex text-white relative'>
          <div
            className='w-96 h-96 absolute bg-white border-2 border-[#111] top-10 px-6 rounded-xl'
            style={{ display: isFilterOpen ? 'block' : 'none' }}
          ></div>
          <button
            type='button'
            className='w-fit h-fit hover:bg-white/25 flex items-center justify-between px-4 py-1 rounded-lg'
            title='Filters'
            aria-label='Filters'
            onClick={() => {
              setIsFilterOpen(!isFilterOpen)
              if (isSortOpen) setIsSortOpen(false)
            }}
          >
            <AdjustmentsHorizontalIcon className='w-6 h-6 mr-1' />
            <p>Filters</p>
          </button>
          <button
            type='button'
            className='w-fit h-fit hover:bg-white/25 flex items-center justify-between px-4 py-1 rounded-lg'
            title='Filters'
            aria-label='Filters'
            onClick={() => {
              setIsSortOpen(!isSortOpen)
              if (isFilterOpen) setIsFilterOpen(false)
            }}
          >
            <ChartBarIcon className='w-6 h-6 mr-1' />
            <p>Sort By</p>
          </button>
        </div>
      </div>
      <div className='w-full h-2/3 flex items-center justify-center mt-10 '>
        <ul className='w-4/5 h-full overflow-y-auto  '>
          {filteredEvents.map((item, index) => (
            <li
              key={index}
              className='w-full h-20 flex items-center justify-between px-4 py-2 border-b-2 border-white hover:bg-white/10'
            >
              <div className='w-1/2 h-full flex flex-col justify-around'>
                <p className='text-white text-sm'>{item.category}</p>
                <p className='text-white text-lg font-bold'>{item.title}</p>
              </div>
              <div className='w-1/2 h-full flex flex-col justify-around'>
                <p className='text-white text-sm'>
                  {new Date(item.startDate).toDateString()}
                </p>
                <p className='text-white text-lg font-bold'>{item.author}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
