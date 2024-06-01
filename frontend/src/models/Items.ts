import Committee, { CommitteePosition } from './Committee'
import Student from './Student'

/**
 * @type Author
 * @description Author type
 * 
 * @param {Student} Student - Student author
 * @param {Committee} Committee - Committee author
 */
type Author = Student | Committee | CommitteePosition

/**
 * @interface Item
 * @description Base News Model
 * 
 * 
 * @param {Author} author - The author of the news item
 * @param {string} title - The title of the news item
 * @param {string} body - The body of the news item
 * @param {string} main_image_url - The main image URL of the news item
 * @param {string[]} sub_image_urls - The sub image URLs of the news item
 * @param {string[]} categories - The categories of the news item
 * @param {string} created_at - The created date of the news item
 * @param {string} last_updated - The last updated date of the news item
 * @param {boolean} is_pinned - Whether the news item is pinned
 * @param {boolean} is_public - Whether the news item is public
 * @param {string} url - The URL of the news item
 */
export default interface News {
  author: Author

  title: string
  short_description: string
  body: string
  main_image_url: string
  sub_image_urls?: string[]
  
  categories?: string[]
  created_at: string
  last_updated?: string
  is_pinned: boolean
  is_public: boolean
  published_status: 'PUBLISHED' | 'DRAFT'
  url: string
}

/**
 * @interface Event
 * @description Event model
 * @extends News
 * 
 * @param {string} location - The location of the event
 * @param {string} start_date - The start date of the event
 * @param {string} end_date - The end date of the event
 */
export interface Event extends News {
  location: string
  start_date: string
  end_date: string
  status: 'UPCOMING' | 'ONGOING' | 'PAST'
}

export interface NewsPagination {
  items: News[]
  page: number
  per_page: number
  total_items: number
  total_pages: number
}