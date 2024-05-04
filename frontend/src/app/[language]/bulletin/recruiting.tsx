'use client'
import { useEffect, useState } from 'react'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { ClockIcon } from '@heroicons/react/24/outline'

// Administrativt
import StyrelsenIcon from 'public/images/committees/styrelsen.png'
import ValberedningenIcon from 'public/images/committees/valberedningen.png'

// Näringsliv och Kommunikation
import NLGIcon from 'public/images/committees/nlg.png'
import KOMNIcon from 'public/images/committees/komn.png'
import MBDIcon from 'public/images/committees/mbd.png'

// Studiesocialt
import QulturnamndenIcon from 'public/images/committees/qn.png'
import MetadorernaIcon from 'public/images/committees/metadorerna.png'
import MetaspexetIcon from 'public/images/committees/metaspexet.png'
import SpexmastereitIcon from 'public/images/committees/spexm.png'
import FestmastereitIcon from 'public/images/committees/festm.png'
import MediasKlubbmasteriIcon from 'public/images/committees/mkm.png'
import IdrottsnamndenIcon from 'public/images/committees/idrottsnamnden.png'
import MatlagetIcon from 'public/images/committees/matlaget.png'
import SanglederietIcon from 'public/images/committees/sanglederiet.png'
import FilmnamndenIcon from 'public/images/committees/filmnamnden.png'

// Utbildning
import StudienamndenIcon from 'public/images/committees/studienamnden.png'
import InternationalsIcon from 'public/images/committees/internationals.png'
const recruitData:
  | {
      title: string
      daysLeft: number
      image: StaticImageData
    }[]
  | undefined = [
  { title: 'Styrelsen', daysLeft: 20, image: StyrelsenIcon },
  { title: 'Valberedningen', daysLeft: 10, image: ValberedningenIcon },
  { title: 'MKM', daysLeft: 5, image: MediasKlubbmasteriIcon },
  { title: 'Filmnämnden', daysLeft: 4, image: FilmnamndenIcon },
  { title: 'Internationell', daysLeft: 16, image: InternationalsIcon },
  { title: 'Metaspex', daysLeft: 12, image: MetaspexetIcon },
  { title: 'Matlaget', daysLeft: 50, image: MatlagetIcon },
  { title: 'MBD', daysLeft: 2, image: MBDIcon },
  { title: 'Idrottsnämnden', daysLeft: 25, image: IdrottsnamndenIcon },
  { title: 'Metadorerna', daysLeft: 1, image: MetadorernaIcon },
]

export default function Recruiting() {
  if (recruitData === undefined) return <></>

  return (
    <section className='w-full h-fit flex flex-col justify-between px-12 relative mt-10'>
      <h2 className='text-3xl uppercase mb-4'>Currently Recruiting</h2>
      <div className='w-full h-5/6 flex items-center mb-20'>
        <div className='w-full h-full overflow-x-auto'>
          <div className='w-full h-full px-8 py-4 grid auto-rows-max grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8'>
            {recruitData
              .sort((a, b) => {
                return a.daysLeft - b.daysLeft
              })
              .map((recruit, index) => (
                <div
                  key={index}
                  className='h-56 border-2 border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 p-4 flex flex-col justify-between transition-transform hover:scale-105'
                >
                  <div className='min-h-20 h-fit flex justify-between items-center'>
                    <Link
                      href={`/chapter/committees/${recruit.title.toLowerCase()}`}
                      title={`${recruit.title} Page`}
                      aria-label={`Go to ${recruit.title} Page`}
                    >
                      <Image
                        src={recruit.image}
                        alt={recruit.title + ' icon'}
                        width={64}
                        height={64}
                      />
                    </Link>
                    <Link
                      href='/'
                      className='px-2 py-2 bg-yellow-400 rounded-xl m-4 hover:bg-yellow-500'
                    >
                      Apply Now
                    </Link>
                  </div>
                  <div>
                    <h3 className='text-xl font-bold uppercase'>
                      {recruit.title}
                    </h3>
                    <p className='text-sm max-h-10 overflow-hidden leading-5'>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                  </div>
                  <div className='h-6 text-sm font-bold flex items-center mt-1'>
                    <ClockIcon className='w-6 h-6 mr-2' />
                    <p>{recruit.daysLeft} days left</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
