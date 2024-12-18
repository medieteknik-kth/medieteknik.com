'use client'

import {
  BackendCategory,
  Course,
  FrontendCategory,
} from '@/app/[language]/education/types/educationTypes'
import { useTranslation } from '@/app/i18n/client'
import { Section } from '@/components/static/Static'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LanguageCode } from '@/models/Language'
import Link from 'next/link'
import { useState, type JSX } from 'react'
import {
  getCategoryColor,
  getCategoryPercentage,
  getHP,
  getLink,
  getTotalHP,
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
    <Section title={title}>
      <Dialog>
        {detailedViewOpen && currentView && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentView.title}
                {currentView.courses && currentView.courses.length > 0 ? (
                  <span className='text-sm'>
                    {' (' +
                      currentView.courses.length +
                      ' ' +
                      t('courses') +
                      ')'}
                  </span>
                ) : (
                  <span className='text-sm'>
                    {' (' + t('no_courses') + ')'}
                  </span>
                )}
              </DialogTitle>
              <DialogDescription>
                {currentView.percentage + '%'}
                {currentView.courses && (
                  <span className='text-sm'>
                    {' (' +
                      t('total_hp') +
                      ': ' +
                      getTotalHP(currentView.courses) +
                      ')'}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            {currentView.courses && (
              <div className='h-fit bg-white dark:bg-[#111]'>
                <ul className='flex flex-col gap-1'>
                  {currentView.courses.map((course, index) => (
                    <li
                      key={index}
                      className='w-full h-fit flex items-center border-l-4 shadow-sm shadow-black/15 rounded-r-md'
                      style={{
                        borderColor: currentView.color,
                      }}
                    >
                      <Button
                        variant='ghost'
                        className='h-fit flex flex-col gap-0.5 justify-start items-start'
                        asChild
                      >
                        <Link
                          href={course.link}
                          className='w-full'
                          target='_blank'
                          rel='noreferrer noopenner'
                        >
                          <p className='tracking-wide text-wrap flex items-center'>
                            {course.title}
                          </p>
                          <p className='text-xs'>{course.hp} HP</p>
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </DialogContent>
        )}
        <div className='w-full h-4/5 flex items-center justify-center py-8 px-10'>
          <div className='w-fit relative h-fit text-2xl flex flex-wrap justify-center gap-8 max-w-[1250px]'>
            {categoryMetadataMap.map((category, index) => (
              <DialogTrigger asChild key={index}>
                <Button
                  variant={'ghost'}
                  className='w-36 lg:w-72 h-auto aspect-square flex flex-col justify-center border-4 items-center px-4 text-center hover:scale-110 transition-all duration-300 ease-in-out rounded-xl shadow-md hover:shadow-lg relative overflow-hidden shadow-[#0000004f] dark:shadow-[#ffffff4f] bg-white dark:bg-[#111] dark:text-white border-black/15 dark:border-white/15'
                  style={{
                    borderColor: category.color,
                  }}
                  onClick={() => {
                    setDetailedViewOpen(true)
                    setCurrentView(category)
                  }}
                >
                  <h3 className='text-sm lg:text-2xl uppercase font-bold tracking-wider text-wrap z-10'>
                    {category.title}
                  </h3>
                  <p className='text-center z-10 text-base lg:text-lg'>
                    {category.percentage} %
                  </p>
                </Button>
              </DialogTrigger>
            ))}
          </div>
        </div>
      </Dialog>
    </Section>
  )
}
