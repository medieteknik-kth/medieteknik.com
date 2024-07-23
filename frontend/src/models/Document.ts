import { LanguageCodes } from '@/utility/Constants'
import { Item } from './Items'

export type DocumentType = 'DOCUMENT' | 'FORM'

export interface Document extends Item {
  type: DocumentType
  translations: DocumentTranslation[]
}

export interface DocumentTranslation {
  title: string
  categories?: string[]
  language_code: LanguageCodes
}