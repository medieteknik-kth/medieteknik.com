import type Item from '../Items'
import type { Author } from '../Items'

/**
 * @type DocumentType
 * @description The type of a document
 *
 * @property {string} DOCUMENT - A document
 * @property {string} FORM - A form
 */
export type DocumentType = 'DOCUMENT' | 'FORM'

/**
 * @interface Document
 * @extends Item
 * @description Describes a document from the backend and API responses
 *
 * @property {string} document_id - The ID of the document (UUID)
 * @property {DocumentType} document_type - The type of the document
 * @property {Author} author - The author of the document
 * @property {DocumentTranslation[]} translations - The translations of the document
 */
export default interface Document extends Item {
  document_id: string
  document_type: DocumentType
  author: Author
  translations: DocumentTranslation[]
}

/**
 * @interface DocumentTranslation
 * @description Holds the translations of each document, is at least 1:1 with the Document model and is used to display the document in different languages
 *
 * @property {string} title - The title of the document
 * @property {string[]} categories - The categories of the document (optional)
 * @property {string} url - The URL of the document
 * @property {string} language_code - The language code of the document
 */
export interface DocumentTranslation {
  title: string
  categories?: string[]
  url: string
  language_code: string
}
