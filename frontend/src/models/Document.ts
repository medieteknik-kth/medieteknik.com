import { LanguageCodes } from '@/utility/Constants'
import { Author, Item } from './Items'

export type DocumentType = 'DOCUMENT' | 'FORM'

export interface Document extends Item {
  document_type: DocumentType
  author: Author
  translations: DocumentTranslation[]
}

export interface DocumentTranslation {
  title: string
  categories?: string[]
  url: string
  language_code: LanguageCodes
}