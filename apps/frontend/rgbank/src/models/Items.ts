import type Committee from '@/models/Committee'
import type { CommitteePosition } from '@/models/Committee'
import type Student from '@/models/Student'


/**
 * @type Author
 * @description What the author of an item can be
 *
 * @property {Student} student - A student
 * @property {Committee} committee - A committee
 * @property {CommitteePosition} committee_position - A committee position
 */
export type Author = Student | Committee | CommitteePosition

/**
 * @type AuthorResource
 * @description What resource(s) the author has access to
 *
 * @property {string} NEWS - News
 * @property {string} EVENT - Event
 * @property {string} DOCUMENT - Document
 * @property {string} ALBUM - Album
 */
export type AuthorResource = 'NEWS' | 'EVENT' | 'DOCUMENT' | 'ALBUM'

/**
 * @type PublishedStatus
 * @description The status of an item
 *
 * @property {string} PUBLISHED - The item is published
 * @property {string} DRAFT - The item is a draft
 */
type PublishedStatus = 'PUBLISHED' | 'DRAFT'

/**
 * @interface Item
 * @description Describes an item from the backend and API responses, used as a base for all items (./items/*)
 *
 * @property {Author} author - The author of the item
 * @property {string[]} categories - The categories of the item (optional)
 * @property {string} created_at - The creation date of the item
 * @property {string} last_updated - The last update date of the item (optional)
 * @property {boolean} is_pinned - Whether the item is pinned
 * @property {boolean} is_public - Whether the item is public
 * @property {'PUBLISHED' | 'DRAFT'} published_status - The published status of the item
 */
export default interface Item {
  author: Author
  categories?: string[]
  created_at: string
  last_updated?: string
  is_pinned: boolean
  is_public: boolean
  published_status: PublishedStatus
}
