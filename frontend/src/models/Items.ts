import Committee from './Committee'
import Student from './Student'

/**
 * @type Author
 * @description Author type
 * 
 * @param {Student} Student - Student author
 * @param {Committee} Committee - Committee author
 */
type Author = Student | Committee

/**
 * @interface Item
 * @description Base News Model
 * 
 * @param {string} title - The title of the news item
 * @param {Author} author - The author of the news item
 * @param {string} imageUrl - The image url of the news item
 * @param {string} creationDate - The creation date of the news item
 * @param {string[]} categories - The categories of the news item
 */
export default interface News {
  id: string
  title: string
  author: Author
  imageUrl: string
  creationDate: string
  categories: string[]
}

/**
 * @interface ShortNewsItem
 * @description Short News Item model
 * @extends News
 * 
 * @param {string} shortDescription - The short description of the news item
 */
export interface ShortNewsItem extends News {
  shortDescription: string
}

/**
 * @interface NewsItem
 * @description News Item model
 * @extends News
 * 
 * @param {string} lastEdited - The last edited date of the news item
 * @param {string} content - The content of the news item
 */
export interface NewsItem extends News {
  lastEdited: string
  content: string
}

/**
 * @interface Event
 * @description Event model
 * @extends News
 * 
 * @param {string} location - The location of the event
 * @param {string} startDate - The start date of the event
 * @param {string} endDate - The end date of the event
 */
export interface Event extends News {
  location: string
  startDate: string
  endDate: string
}

/**
 * @interface ShortEventItem
 * @description Short Event Item model
 * @extends Event
 * 
 * @param {string} shortDescription - The short description of the event
 */
export interface ShortEventItem extends Event {
  shortDescription: string
}

/**
 * @interface EventItem
 * @description Event Item model
 * @extends Event
 * 
 * @param {string} lastEdited - The last edited date of the event
 * @param {string} content - The content of the event
 */
export interface EventItem extends Event {
  lastEdited: string
  content: string
}