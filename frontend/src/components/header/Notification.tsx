'use client'
import { useState } from 'react'
import { BellAlertIcon, BellIcon } from '@heroicons/react/24/outline'

export default function NotificationHeader({
  params: { language },
}: {
  params: { language: string }
}) {
  const [isOpen, setIsOpen] = useState(false)
  const notifications: number = 4
  return (
    <div className='w-20 mr-2 z-10 relative'>
      <div
        className={`w-screen h-screen ${
          isOpen ? 'block' : 'hidden'
        } fixed -z-50 left-0 top-0`}
        onClick={() => setIsOpen(false)}
      />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-fit h-full px-4 grid z-10 place-items-center border-b-2 ${
          isOpen
            ? 'border-yellow-400 bg-black/25'
            : 'border-transparent bg-transparent'
        } hover:border-yellow-400 hover:bg-black/25`}
        title='Notifications'
        aria-label='Notifications Button'
        aria-expanded={isOpen}
      >
        {notifications > 0 ? (
          <div className='relative'>
            <BellIcon className='w-8 h-8' />
            <span className='absolute top-0 right-0 w-4 h-4 bg-yellow-500 rounded-full text-xs text-black grid place-items-center'>
              {notifications > 9 ? '9+' : notifications}
            </span>
          </div>
        ) : (
          <BellIcon className='w-8 h-8' />
        )}
      </button>
      <div
        className={`min-w-60 w-1/2 md:w-96 h-96 flex-col bg-white absolute border-2 text-black border-gray-300 border-t-0 ${
          isOpen ? 'flex' : 'hidden'
        } top-24 right-4 z-50`}
        role='dialog'
      >
        <h1 className='w-full h-12 text-center text-2xl uppercase grid place-items-center'>
          Notifications
        </h1>
      </div>
    </div>
  )
}
