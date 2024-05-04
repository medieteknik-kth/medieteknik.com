import { PlusIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

import Link from 'next/link'

import TestBG from 'public/images/testbg.jpg'

const MockEvents = [
  {
    date: 'today',
    time: '18:00',
    title: 'Event 1',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum, nam? Hic totam temporibus adipisci ad neque consequatur a sunt sequi.',
  },
  {
    date: '22 - 31 oct',
    time: '10:00',
    title: 'Event 2',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum, nam? Hic totam temporibus adipisci ad neque consequatur a sunt sequi.',
  },
  {
    date: '22 - 31 oct',
    time: '19:00',
    title: 'Event 3',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum, nam? Hic totam temporibus adipisci ad neque consequatur a sunt sequi.',
  },
  {
    date: '13 - 31 dec',
    time: '12:00',
    title: 'Event 4',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum, nam? Hic totam temporibus adipisci ad neque consequatur a sunt sequi.',
  },
  {
    date: 'today',
    time: '18:00',
    title: 'Event 5',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum, nam? Hic totam temporibus adipisci ad neque consequatur a sunt sequi.',
  },
  {
    date: 'today',
    time: '18:00',
    title: 'Event 6',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum, nam? Hic totam temporibus adipisci ad neque consequatur a sunt sequi.',
  },
  {
    date: 'today',
    time: '18:00',
    title: 'Event 7',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum, nam? Hic totam temporibus adipisci ad neque consequatur a sunt sequi.',
  },
  {
    date: 'today',
    time: '18:00',
    title: 'Event 8',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum, nam? Hic totam temporibus adipisci ad neque consequatur a sunt sequi.',
  },
  {
    date: 'today',
    time: '18:00',
    title: 'Event 9',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum, nam? Hic totam temporibus adipisci ad neque consequatur a sunt sequi.',
  },
  {
    date: 'today',
    time: '18:00',
    title: 'Event 10',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum, nam? Hic totam temporibus adipisci ad neque consequatur a sunt sequi.',
  },
]

const MockNews = [
  {
    title: 'News 1',
    author: 'Styrelsen',
    link: '/news/1',
    description:
      'upper page kill fifteen truth forgotten post important forest position sent television gold forth quite discovery score win ship hardly volume man replace few',
    date: '2/21/2110',
  },
  {
    title: 'News 2',
    author: 'André Eriksson',
    link: '/news/2',
    description:
      'gift plane excellent tank kill some large foot law weather third price continued cover bear block section vowel certainly understanding farm single settlers fruit',
    date: '8/24/2041',
  },
  {
    title: 'News 3',
    author: 'Viggo Halvarsson Skoog',
    link: '/news/3',
    description:
      'driver property lay receive doll dropped decide speak coach reason weight street clearly exchange government prepare carry sat faster capital where strange shape chance',
    date: '11/14/2067',
  },
  {
    title: 'News 4',
    author: 'Valberedningen',
    link: '/news/4',
    description:
      'trick real great fellow darkness screen today order happily success function leg barn vessels pictured dug pet even classroom underline climb trip chosen smoke',
    date: '11/27/2051',
  },
]

function Event() {
  return (
    <section className='w-1/3 h-full'>
      <h3 className='text-2xl uppercase tracking-wider text-center pb-6'>
        Upcoming Events
      </h3>
      <div className='w-full h-[710px] overflow-hidden overflow-y-auto'>
        <ul className='*:h-[110px] px-8'>
          {MockEvents.map((event, index) => (
            <li
              key={index}
              className='flex items-center justify-between border-b-2 border-gray-300 border-r-2 mb-10 last:mb-0 last:border-0'
            >
              <div className='w-20 h-20 uppercase flex flex-col items-center justify-center'>
                <p className='text-sm'>{event.date}</p>
                <p className='text-2xl'>{event.time}</p>
              </div>
              <div className='w-1/2 h-4/5 flex flex-col relative'>
                <h4 className='text-xl absolute top-2'>{event.title}</h4>
                <div className='overflow-hidden h-2/3 overflow-y-auto absolute top-10'>
                  <p className='text-xs'>{event.description}</p>
                </div>
              </div>
              <Link
                href='/'
                className='py-2 w-48 bg-gray-200 rounded-2xl flex justify-between items-center px-4 mr-2'
              >
                <p>Add to Calendar</p>
                <PlusIcon className='w-5 h-5' />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function News() {
  return (
    <section className='w-full h-[1080px] relative flex flex-col p-20'>
      <h2 className='w-full h-fit text-3xl uppercase text-black tracking-wider text-center font-bold border-b-2 border-yellow-400 p-10 pb-4 mb-10'>
        News & Events
      </h2>
      <div className='w-full h-5/6 flex'>
        <div className='w-2/3 h-full grid grid-cols-2 grid-rows-2 gap-8'>
          {MockNews.map((news, index) => (
            <Link
              href={news.link}
              key={index}
              title={news.title}
              aria-label={news.title}
              aria-description={`Title: ${news.title}, Description: ${news.description}, Author: ${news.author}, Date: ${news.date}`}
            >
              <Image
                src={TestBG}
                alt='Test Background'
                width={400}
                height={200}
                className='w-full h-3/5 object-cover'
              />
              <div className='w-full h-2/5 flex flex-col px-4 py-2 justify-between border-2 border-t-0 border-l-0 border-gray-300'>
                <div>
                  <h3 className='text-2xl leading-relaxed'>{news.title}</h3>
                  <p className='text-sm h-10 text-pretty'>{news.description}</p>
                </div>

                <div className='w-full h-10 flex items-center justify-between uppercase text-sm'>
                  <div className='flex items-center'>
                    <div className='w-8 h-8 rounded-full border-2 border-black mr-4' />
                    <p>{news.author}</p>
                  </div>
                  <p>{news.date}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Event />
      </div>
    </section>
  )
}
