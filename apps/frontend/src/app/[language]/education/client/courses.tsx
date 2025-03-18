'use client'

import type {
  BackendCategory,
  Course,
  FrontendCategory,
} from '@/app/[language]/education/types/educationTypes'
import { useTranslation } from '@/app/i18n/client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import type { LanguageCode } from '@/models/Language'
import { Link } from 'next-view-transitions'
import { type JSX, useState } from 'react'
import {
  getCategoryColor,
  getCategoryPercentage,
  getHP,
  getLink,
} from '../constants'

interface Props {
  language: LanguageCode
}

/**
 * @name Courses
 * @description The courses page, contains the list of courses and their respective category
 *
 * @param {Props} props - The properties of the component
 * @param {LanguageCode} props.language - The language of the page
 * @returns {JSX.Element} The courses page
 */
export default function Courses({ language }: Props): JSX.Element {
  const [detailedViewOpen, setDetailedViewOpen] = useState(false)
  const [currentView, setCurrentView] = useState<FrontendCategory | null>(null)
  const { t } = useTranslation(language, 'education')
  const categories: BackendCategory[] = t('categories', {
    returnObjects: true,
  }) as BackendCategory[]

  const categoryMetadataMap: FrontendCategory[] = categories.map((category) => {
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
    <section className='flex flex-col gap-4 sm:px-4 md:px-8 mx-auto container'>
      <h2 className='font-semibold text-2xl sm:text-4xl w-full'>{title}</h2>
      <Accordion
        collapsible
        type='single'
        className='grid grid-cols-1 lg:grid-cols-2 desktop:grid-cols-[repeat(auto-fill,minmax(30vw,_1fr))]! gap-x-4 gap-y-2'
      >
        {categoryMetadataMap.map((category, index) => (
          <AccordionItem value={index.toString()} key={category.title}>
            <AccordionTrigger
              className='w-full flex justify-between items-center px-4 rounded-lg'
              style={{
                border: `2px solid ${category.color}`,
              }}
            >
              <div className='flex flex-col items-start no-underline!'>
                <h2 className='text-xl font-bold'>{category.title}</h2>
                <p className='text-sm'>{category.percentage}%</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className='px-2 mt-4'>
              <ul className='flex flex-col gap-2'>
                {category.courses?.map((course) => (
                  <li
                    className='flex justify-between items-center border-l-2 pl-2'
                    style={{
                      borderColor: category.color,
                    }}
                    key={course.title}
                  >
                    <div className='flex flex-col'>
                      <h3>{course.title}</h3>
                      <span className='text-xs font-bold'>{course.hp} HP</span>
                    </div>
                    <Button
                      asChild
                      variant={'link'}
                      className='text-blue-500 dark:text-primary'
                    >
                      <Link href={course.link}>{t('go_to_course')}</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
