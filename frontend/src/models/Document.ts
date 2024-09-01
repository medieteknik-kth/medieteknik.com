import { Author, Item } from './Items'
import { LanguageCode } from './Language'

export type DocumentType = 'DOCUMENT' | 'FORM'

export interface Document extends Item {
  document_id: string
  document_type: DocumentType
  author: Author
  translations: DocumentTranslation[]
}

export interface DocumentTranslation {
  title: string
  categories?: string[]
  url: string
  language_code: LanguageCode
}