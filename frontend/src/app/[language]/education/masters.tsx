'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import ComputerScienceBG from '/public/images/cs.jpg'
import InteractiveMediaBG from '/public/images/imt.jpg'
import ICTBG from '/public/images/ict.jpg'
import MachineLearingBG from '/public/images/ml.jpg'
import SustainableDigitalisationBG from '/public/images/sd.jpg'
import { useRef, useState } from 'react'

const carouselItems = [
  {
    id: 1,
    title: 'Computer Science',
    description:
      'Computer Science is the study of computers and computational systems. Unlike electrical and computer engineers, computer scientists deal mostly with software and software systems; this includes their theory, design, development, and application.',
    image: ComputerScienceBG,
    kthLink: 'https://www.kth.se/en/studies/master/computer-science',
    keyAreas: [
      'AI',
      'Networking and Communication',
      'Security',
      'Data Science',
      'Algorithms and Complexity',
    ],
  },
  {
    id: 2,
    title: 'Interactive Media Technology',
    description:
      "Interactive Media Technology is a two-year master's programme that focuses on Interactive Media, Computer Graphics and Computer Games. The programme offers a broad theoretical foundation in the field of interactive media technology, and the ability to apply this knowledge to create future interactive media.",
    image: InteractiveMediaBG,
    kthLink:
      'https://www.kth.se/en/studies/master/interactive-media-technology',
    keyAreas: [
      'Graphics and Visualisation',
      'Interactive Systems',
      'User Experience',
      'Sound and Music Computing',
    ],
  },
  {
    id: 3,
    title: 'ICT Innovation',
    description:
      "ICT Innovation is a two-year master's programme that focuses on the analysis, design, use and development of complex software systems and services for the needs of industry and society. The programme offers a broad theoretical foundation in the field of software technology and the ability to apply this knowledge to solve real-world problems.",
    image: ICTBG,
    kthLink: 'https://www.kth.se/en/studies/master/ict-innovation/',
    keyAreas: [
      'Marketing and Market Analysis',
      'Consulting and Management',
      'Systems and Software',
      'Entrepreneur',
    ],
  },
  {
    id: 4,
    title: 'Machine Learning',
    description:
      "Machine Learning is a two-year master's programme that focuses on the theoretical foundation of machine learning and computational learning theory, as well as the practical application of machine learning methods to real-world problems.",
    image: MachineLearingBG,
    kthLink: 'https://www.kth.se/en/studies/master/machine-learning/',
    keyAreas: ['Machine Learning', 'AI', 'Optimization', 'Computer Vision'],
  },
  {
    id: 5,
    title: 'Sustainable Digitalisation',
    description:
      'Digitalisation is a powerful driver of societal change; it offers the potential to build resilience for a volatile, uncertain, complex and ambiguous future. But digitalisation can also be problematic if it speeds up unsustainable trends.',
    image: SustainableDigitalisationBG,
    kthLink: 'https://www.kth.se/en/studies/master/sustainable-digitalisation',
    keyAreas: [
      'Sustainability',
      'Digitalisation',
      'Innovation',
      'Strategic Leadership',
    ],
  },
]

export default function Masters() {
  const [activeIndex, setActiveIndex] = useState(2)

  const toNext = () => {
    const nextIndex = (activeIndex + 1) % carouselItems.length
    setActiveIndex(nextIndex)
  }

  const toBack = () => {
    const prevIndex =
      (activeIndex - 1 + carouselItems.length) % carouselItems.length
    setActiveIndex(prevIndex)
  }

  return (
    <section
      id='masters'
      className='w-full h-[1080px] bg-[#111] text-white relative flex flex-col items-center'
    >
      <div className='w-full text-center grid place-items-center'>
        <h2 className='uppercase tracking-wider font-semibold text-3xl w-2/4 border-b-2 border-yellow-400 py-8'>
          Masters
        </h2>
      </div>

      <div className='w-full h-3/4 z-10'>
        <ul className='w-full h-full flex justify-around relative'>
          {carouselItems.map((item, index) => (
            <li
              key={index}
              className={`h-full absolute ${
                activeIndex == index ? 'inset-0 z-30' : ''
              }
                ${
                  index == activeIndex - 1 ||
                  (activeIndex == 0 && index == carouselItems.length - 1)
                    ? '-left-1/3 right-0 scale-95 -z-20 bg-black/65'
                    : ''
                }

                ${
                  index == activeIndex + 1 ||
                  (activeIndex == carouselItems.length - 1 && index == 0)
                    ? '-right-1/3 left-0 scale-95 -z-20 bg-black/65'
                    : ''
                }
                ${
                  index >= activeIndex + 2 ||
                  index <= activeIndex - 2 ||
                  (activeIndex == 0 && index == 2)
                    ? 'duration-1000 -z-20 inset-0 scale-95'
                    : 'block'
                }
                transition-all ease-in duration-500 m-auto w-1/2`}
            >
              <div
                className={`w-full h-full absolute bg-inherit ${
                  index == activeIndex ? 'z-10' : 'z-20'
                }`}
              />
              <Image
                src={item.image.src}
                alt={item.title}
                width={500}
                height={720}
                className='w-auto h-full object-cover'
              />

              <div className='relative w-full h-full bottom-full z-10'>
                <div className='w-full h-60 absolute bottom-0 px-8 bg-black/75 flex justify-between items-center backdrop-blur-xl overflow-hidden border-t-2 border-yellow-400'>
                  <div className='h-full relative flex flex-col justify-around py-4'>
                    <h3 className='text-3xl font-semibold uppercase tracking-wider mb-4'>
                      {item.title}
                    </h3>
                    <p className='text-lg max-w-3xl mb-4'>{item.description}</p>
                    <p className=''>
                      <span className='text-yellow-400'>Key Areas:</span>{' '}
                      {item.keyAreas.join(', ')}
                    </p>
                  </div>

                  <Link
                    href={item.kthLink}
                    target='_blank'
                    rel='noreferrer noopener'
                    className='w-40 h-12 grid place-items-center text-center bg-[#007fae] border-[1px] border-[#007fae] p-6 py-2 rounded-xl bottom-0 relative font-semibold tracking-wider'
                  >
                    Read on KTH
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className='text-center mt-10'>
          {carouselItems.map((item, index) => (
            <button
              title={item.title}
              key={index}
              className={`w-4 h-4 mx-2 rounded-full ${
                activeIndex == index ? 'bg-yellow-400' : 'bg-white'
              }`}
              onClick={() => setActiveIndex(index)}
            ></button>
          ))}
        </div>
      </div>

      <button
        className='absolute top-1/2 left-16 p-4 z-10 -translate-y-1/2'
        onClick={toBack}
        title='Previous Page'
      >
        <ArrowLeftIcon className='w-8 h-8 text-yellow-400' />
      </button>
      <button
        className='absolute top-1/2 right-16 p-4 z-10 -translate-y-1/2'
        onClick={toNext}
        title='Next Page'
      >
        <ArrowRightIcon className='w-8 h-8 text-yellow-400' />
      </button>
    </section>
  )
}
