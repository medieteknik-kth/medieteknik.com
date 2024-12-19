import type { StaticImageData } from 'next/image'

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
export interface Course {
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
export interface BackendCategory {
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
export interface FrontendCategory {
  title: string
  percentage: number
  color: string
  courses?: Course[]
}

export interface CarouselItem {
  id: number
  title: string
  description: string
  image: StaticImageData
  kthLink: string
  keyAreas: string[]
}

type Flag = 'closed' | 'new'

export interface Master {
  title: string
  description: string
  kth_link: string

  // Additional information
  flags?: {
    flag: Flag // What type of flag it is
    applies: string
    description: string
  }[]
  tags: string[]
}
