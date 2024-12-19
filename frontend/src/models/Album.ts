import type Media from '@/models/items/Media'

/**
 * @interface Album
 * @description Describes an album from the backend and API responses
 *
 * @property {string} album_id - The ID of the album (UUID)
 * @property {number} total_images - The total number of images in the album
 * @property {number} total_videos - The total number of videos in the album
 * @property {string} updated_at - The last update date of the album
 * @property {Media} preview_media - The preview media of the album (optional)
 * @property {AlbumTranslation[]} translations - The translations of the album
 */
export default interface Album {
  album_id: string
  total_images: number
  total_videos: number
  updated_at: string
  preview_media?: Media
  translations: AlbumTranslation[]
}

/**
 * @interface AlbumTranslation
 * @description Holds the translations of each album, is at least 1:1 with the Album model and is used to display the album in different languages
 *
 * @property {string} title - The title of the album
 * @property {string} description - The description of the album
 */
export interface AlbumTranslation {
  title: string
  description: string
}
