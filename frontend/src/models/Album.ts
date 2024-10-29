import { Media } from '@/models/items/Media'

export default interface Album {
  album_id: string
  total_images: number
  total_videos: number
  updated_at: string
  preview_media?: Media
  translations: AlbumTranslation[]
}

export interface AlbumTranslation {
  title: string
  description: string
}
