'use client'
import { Button } from '@/components/ui/button'
import { PencilIcon } from '@heroicons/react/24/outline'

export default function TagsPage({ language }: { language: string }) {
  return (
    <section className='w-full h-full min-h-[1080px] flex flex-col relative ml-24 pt-8'>
      <div>
        <h1 className='text-4xl'>Avaliable Tags</h1>
        <p>Click on the tag you want to add. You can add multiple tags. </p>
      </div>
      <Button className='w-fit my-4'>
        <PencilIcon className='w-5 h-5 mr-2' />
        <p>Create a new tag</p>
      </Button>
      <div>
        <h2 className='text-2xl'>Tags</h2>
        <ul className='*:mb-2'>
          <li>
            <Button variant={'outline'}>
              <p>Administrative</p>
            </Button>
          </li>
          <li className='w-fit flex items-center'>
            <Button variant={'outline'}>
              <p>Administrative</p>
            </Button>
          </li>
        </ul>
      </div>
    </section>
  )
}
