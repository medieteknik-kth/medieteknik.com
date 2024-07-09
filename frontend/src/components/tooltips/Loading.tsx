import { ArrowPathIcon } from '@heroicons/react/24/outline'

export default function Loading({ language }: { language: string }) {
  return (
    <div className='w-full h-full flex items-center justify-center my-2'>
      <ArrowPathIcon className='w-8 h-8 animate-spin text-black mr-4' />
      <p className=''>Loading...</p>
    </div>
  )
}
