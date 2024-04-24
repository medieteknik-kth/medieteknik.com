'use client'
import { PieChart } from 'react-minimal-pie-chart'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Section } from '@/components/static/Static'
import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/app/i18n/client'
import {
  getLink,
  getHP,
  getCategoryColor,
  getCategoryPercentage,
} from './constants'

/**
 * @interface Course
 * @description The course object that is used in the frontend
 *
 * @property {string} title - The title of the course
 * @property {number} hp - The number of hp of the course
 * @property {string} link - The link to the course
 *
 * @see FrontendCategory
 */
interface Course {
  title: string
  hp: number
  link: string
}

/**
 * @interface BackendCategory
 * @description The category object that is used in the backend, i.e. translation files
 *
 * @property {string} id - The id of the category
 * @property {string} title - The title of the category
 * @property {string} color - The color of the category
 * @property {string[]} courses - The courses in the category (if any)
 * @see FrontendCategory
 */
interface BackendCategory {
  id: string
  title: string
  color?: string
  courses?: string[]
}

/**
 * @interface FrontendCategory
 * @description The category object that is used in the frontend, transformed from the backend category object
 *
 * @property {string} title - The title of the category
 * @property {number} percentage - The percentage of the category
 * @property {string} color - The color of the category
 * @property {Course[]} courses - The courses in the category (if any)
 * @see BackendCategory
 */
interface FrontendCategory {
  title: string
  percentage: number
  color: string
  courses?: Course[]
}

export default function Courses({
  params: { language },
}: {
  params: { language: string }
}) {
  const [detailedViewOpen, setDetailedViewOpen] = useState(false)
  const [currentView, setCurrentView] = useState<FrontendCategory | null>(null)
  const { t } = useTranslation(language, 'education')
  const categories: BackendCategory[] = t('categories', { returnObjects: true })

  let categoryMetadataMap: FrontendCategory[] = categories.map((category) => {
    if (!category.courses)
      return {
        title: category.title,
        percentage: getCategoryPercentage(category.id),
        color: getCategoryColor(category.id),
        courses: [],
      }

    return {
      title: category.title,
      percentage: getCategoryPercentage(category.id),
      color: getCategoryColor(category.id),
      courses: category.courses.map((course, index): Course => {
        return {
          title: course,
          hp: getHP(category.id.toLowerCase(), index),
          link: getLink(category.id.toLowerCase(), index, language === 'sv'),
        }
      }),
    }
  }) as FrontendCategory[]

  const title = t('courses')

  // TODO: Multiple views? Pie chart?
  
  return (
    <Section title={title}>
      <div className='w-full h-[700px] flex justify-between items-center '>
        {detailedViewOpen && currentView ? (
          <div className='fixed w-screen h-screen bg-black/20 top-0 left-0 z-20 grid place-items-center'>
            <div className='w-[550px] h-fit relative'>
              <h3
                className='h-20 text-2xl text-white uppercase font-bold tracking-wider grid place-items-center rounded-t-xl border-b-2 border-black/15'
                style={{ backgroundColor: currentView.color }}
              >
                {currentView.title}
              </h3>
              <button
                className='w-10 h-10 absolute top-2 right-2 grid place-items-center text-white hover:bg-black/10 hover:text-black rounded-full'
                onClick={() => setDetailedViewOpen(false)}
              >
                <XMarkIcon className='w-8 h-8' />
              </button>
              <div className='h-fit border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-b-xl shadow-sm shadow-gray-300'>
                <ul>
                  {currentView.courses?.map((course, index) => (
                    <li
                      key={index}
                      className={`h-12 px-4 py-2 flex items-center ${
                        index === 0 ||
                        index === (currentView.courses?.length ?? 0) - 1
                          ? ''
                          : 'border-b-2'
                      }`}
                    >
                      <Link
                        href={new URL(course.link)}
                        className='w-full h-full flex justify-between items-center px-2 py-1 hover:underline decoration-yellow-400 decoration-2 underline-offset-4'
                        rel='noopener noreferrer'
                        target='_blank'
                      >
                        <span>{course.title}</span>
                        <span>{course.hp} hp</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className='w-full h-4/5 flex items-center justify-center'>
          <div className='w-fit relative h-fit text-2xl grid grid-cols-4 auto-rows-max *:w-72 *:h-72 gap-8'>
            {categoryMetadataMap.map((category, index) => (
              <button
                key={index}
                className='w-full h-full flex flex-col justify-center items-center px-4 text-center hover:scale-110 transition-transform duration-300 ease-in-out rounded-xl shadow-md hover:shadow-lg'
                style={{
                  backgroundColor: category.color,
                }}
                onClick={() => {
                  setDetailedViewOpen(true)
                  setCurrentView(category)
                }}
              >
                <h3 className='text-2xl text-white uppercase font-bold tracking-wider'>
                  {category.title}
                </h3>
                <p className='text-white text-center'>
                  {category.percentage} %
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
