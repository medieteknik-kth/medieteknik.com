import Album from '@/models/Album'
import { Event, News } from './Items'
import { Document } from './items/Document'
import Student, { StudentMembership } from './Student'
import { Media } from '@/models/items/Media'

interface Pagniation {
  page: number
  per_page: number
  total_items: number
  total_pages: number
}

export interface StudentPagination extends Pagniation {
  items: Student[]
}

export interface StudentMembershipPagination extends Pagniation {
  items: StudentMembership[]
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

export interface MediaPagination extends Pagniation {
  items: Media[]
}

export interface AlbumPagination extends Pagniation {
  items: Album[]
}
