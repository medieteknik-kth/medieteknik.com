import { Document } from './Document'
import { Event, News } from './Items'

interface Pagniation {
  page: number
  per_page: number
  total_items: number
  total_pages: number
}

export interface NewsPagination extends Pagniation {
  items: News[]
}

export interface EventPagniation extends Pagniation {
  items: Event[]
}

export interface DocumentPagination extends Pagniation {
  items: Document[]
}