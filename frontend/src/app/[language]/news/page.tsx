import Image from 'next/image'
import SearchBar from './search'
import Events from './events/events'
import Recruiting from './recruiting'
import ExtraNews from './extranews'

import BG from 'public/images/kth-landskap.jpg'

const breakingNews = [
  {
    id: 1,
    title: 'News 1',
    time: '2 hours ago',
    author: 'Styrelsen',
    description: 'This is a description of the news',
    image: BG,
  },
  {
    id: 2,
    title: 'News 2',
    time: '12 hours ago',
    author: 'Valberedningen',
    description: 'This is a description of the news',
    image: BG,
  },
  {
    id: 3,
    title: 'News 3',
    time: '4 days ago',
    author: 'Kommunikationsnämnden',
    description: 'This is a description of the news',
    image: BG,
  },
]

import { ClockIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function News({
  params: { language },
}: {
  params: { language: string }
}) {
  return (
    <main>
      <div className='h-24 bg-black' />
      <div className=''>
        <SearchBar />
      </div>
      <div className='w-full h-fit flex flex-col justify-center px-12'>
        <div className='h-fit flex justify-between items-center'>
          <h2 className='uppercase text-gray-600 py-2 text-lg tracking-wide'>
            Breaking News
          </h2>
          <Link href='/' className='text-blue-700 underline underline-offset-2'>
            {' '}
            View All{' '}
          </Link>
        </div>
        <div className='w-full relative overflow-x-auto'>
          <div className='w-full h-fit grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 auto-rows-max *:h-32 md:*:h-48 gap-12'>
            {breakingNews.map((news) => (
              <div
                key={news.id}
                className='flex relative border-b-2 border-r-2 border-gray-300 rounded-r-xl shadow-sm shadow-gray-300 rounded-xl md:rounded-l-xl'
              >
                <div className='w-full absolute md:block md:w-auto md:min-w-20 md:max-w-56 h-full bg-[#111] rounded-xl md:rounded-l-xl md:relative -z-10 md:z-0'>
                  <div className='w-full h-full absolute bg-black/75 md:bg-black/25 z-10 rounded-xl md:rounded-l-xl' />
                  <Image
                    src={news.image}
                    alt=''
                    width={256}
                    height={171}
                    className='w-full md:w-auto h-32 md:h-full object-cover md:object-fill rounded-xl md:rounded-l-xl'
                  />
                </div>
                <div className='w-auto h-full ml-4 pr-2 flex flex-col justify-around'>
                  <Link
                    href='/'
                    className='h-fit max-h-36 font-bold text-xl overflow-hidden text-white md:text-black'
                  >
                    {news.title}
                  </Link>
                  <div></div>
                  <div className='h-fit flex flex-col justify-between text-white md:text-gray-600 '>
                    <div className='flex items-center mb-2'>
                      <div className='w-6 h-6 border-2 border-gray-600 rounded-full mr-2' />
                      <p className='mr-2 max-w-40 xs:max-w-fit lg:max-w-36 xl:max-w-60 2xl:max-w-36 desktop:max-w-fit text-sm uppercase tracking-wide truncate'>
                        {news.author}
                      </p>
                    </div>
                    <div className='flex items-center'>
                      <ClockIcon className='w-6 h-6 mr-2' />
                      <span className='text-sm'>{news.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Events params={{ language }} />
      <Recruiting />
      <ExtraNews />
    </main>
  )
}
