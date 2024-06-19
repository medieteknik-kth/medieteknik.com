import Student from '@/models/Student'
import { CommitteePosition } from '@/models/Committee'
import { UsersIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import TestBG from 'public/images/kth-landskap.jpg'

export default function CommitteeMembers({
  language,
  committee,
}: {
  language: string
  committee: string
}) {
  const committeeName = decodeURIComponent(committee)

  return (
    <section className='h-fit relative'>
      <div className='pt-12 mb-10 grid place-items-center'>
        <h2 className='text-3xl capitalize'>
          Meet <span className='font-bold'>{committeeName}</span>
        </h2>
      </div>
      <div className='w-full h-full flex flex-wrap gap-8 justify-center grid-flow-row px-12 mb-6'>
        <div className='w-52 h-52 lg:w-96 lg:h-96 border relative rounded-xl'>
          <Image
            src={TestBG.src}
            alt='img'
            fill
            className='object-cover rounded-xl'
          />
          <div className='w-full absolute bottom-0 py-4 bg-black/50 text-white border-t-2 backdrop-blur-xl border-yellow-400 flex justify-between rounded-b-xl px-4'>
            <div>
              <h3 className='max-w-40 text-xl leading-5 font-bold truncate'>
                André Eriksson Eriksson Eriksson Eriksson Eriksson Eriksson
              </h3>
              <p className='tracking-wider'>Chairman</p>
            </div>
            <div className='hidden lg:block'>
              <Button size={'icon'}>
                <UsersIcon className='w-5 h-5' />
              </Button>
            </div>
          </div>
        </div>
        <div className='w-52 h-52 lg:w-96 lg:h-96 bg-neutral-300' />
        <div className='w-52 h-52 lg:w-96 lg:h-96 bg-black' />
        <div className='w-52 h-52 lg:w-96 lg:h-96 bg-neutral-300' />
        <div className='w-52 h-52 lg:w-96 lg:h-96 bg-black' />
        <div className='w-52 h-52 lg:w-96 lg:h-96 bg-neutral-300' />
        <div className='w-52 h-52 lg:w-96 lg:h-96 bg-black' />
        <div className='w-52 h-52 lg:w-96 lg:h-96 bg-neutral-300' />
        <div className='w-52 h-52 lg:w-96 lg:h-96 bg-black' />
        <div className='w-52 h-52 lg:w-96 lg:h-96 bg-neutral-300' />
      </div>
    </section>
  )
}
