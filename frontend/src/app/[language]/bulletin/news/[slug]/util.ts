import type Committee from '@/models/Committee'
import type { CommitteePosition } from '@/models/Committee'
import type { Author } from '@/models/Items'
import type Student from '@/models/Student'

/**
 * @name assignCorrectAuthor
 * @description Assigns the correct author type to the author object
 *
 * @param {Author} author - The author object
 * @returns {Author | null} The author object with the correct author type or null if the author type is not found
 */
export function assignCorrectAuthor(author: Author): Author | null {
  switch (author.author_type) {
    case 'STUDENT':
      return author as Student
    case 'COMMITTEE':
      return author as Committee
    case 'COMMITTEE_POSITION':
      return author as CommitteePosition
    default:
      return null
  }
}
