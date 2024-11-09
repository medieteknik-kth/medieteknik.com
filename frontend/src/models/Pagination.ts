import Album from '@/models/Album'
import Document from '@/models/items/Document'
import Event from '@/models/items/Event'
import Media from '@/models/items/Media'
import News from '@/models/items/News'
import Student, { StudentMembership } from '@/models/Student'

/**
 * @interface Pagniation
 * @description The pagination pattern, each child interface extends this interface and should have an `items` property
 *
 * @property {number} page - The current page
 * @property {number} per_page - The number of items per page
 * @property {number} total_items - The total number of items
 * @property {number} total_pages - The total number of pages
 */
interface Pagniation {
  page: number
  per_page: number
  total_items: number
  total_pages: number
}

/**
 * @interface StudentPagination
 * @extends Pagniation
 * @description The pagination for students
 *
 * @property {Student[]} items - The students
 */
export interface StudentPagination extends Pagniation {
  items: Student[]
}

/**
 * @interface StudentMembershipPagination
 * @extends Pagniation
 * @description The pagination for student memberships
 *
 * @property {StudentMembership[]} items - The student memberships
 */
export interface StudentMembershipPagination extends Pagniation {
  items: StudentMembership[]
}

/**
 * @interface NewsPagination
 * @extends Pagniation
 * @description The pagination for news
 *
 * @property {News[]} items - The news
 */
export interface NewsPagination extends Pagniation {
  items: News[]
}

/**
 * @interface EventPagniation
 * @extends Pagniation
 * @description The pagination for events
 *
 * @property {Event[]} items - The events
 */
export interface EventPagniation extends Pagniation {
  items: Event[]
}

/**
 * @interface DocumentPagination
 * @extends Pagniation
 * @description The pagination for documents
 *
 * @property {Document[]} items - The documents
 */
export interface DocumentPagination extends Pagniation {
  items: Document[]
}

/**
 * @interface MediaPagination
 * @extends Pagniation
 * @description The pagination for media
 *
 * @property {Media[]} items - The media
 */
export interface MediaPagination extends Pagniation {
  items: Media[]
}

/**
 * @interface AlbumPagination
 * @extends Pagniation
 * @description The pagination for albums
 *
 * @property {Album[]} items - The albums
 */
export interface AlbumPagination extends Pagniation {
  items: Album[]
}
