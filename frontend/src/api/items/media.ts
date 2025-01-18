import { type ApiResponse, fetchData } from '@/api/api'
import type Album from '@/models/Album'
import type { LanguageCode } from '@/models/Language'
import type { AlbumPagination, MediaPagination } from '@/models/Pagination'
import type Media from '@/models/items/Media'
import { API_BASE_URL } from '@/utility/Constants'

/**
 * @name getMediaData
 * @description Get the media data for a specific language and committee
 *
 * @param {LanguageCode} language_code - The language to get media in
 * @param {string} committee_id - The committee ID to get media for
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 1 hour)
 * @returns {Promise<APIResponse<MediaPagination>>} The API response with the media data or an error
 */
export const getMediaData = async (
  language_code: LanguageCode,
  committee_id: string,
  revalidate = 3_600
): Promise<ApiResponse<MediaPagination>> => {
  const { data, error } = await fetchData<MediaPagination>(
    `${API_BASE_URL}/public/media/author/${committee_id}?language=${language_code}`,
    {
      next: {
        revalidate: revalidate, // 1 hour or user defined
      },
    }
  )

  if (error) {
    return { data, error }
  }

  return { data, error: null }
}

/**
 * @name getAlbums
 * @description Get the albums for a specific language
 *
 * @param {LanguageCode} language_code - The language to get albums in
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 1 hour)
 * @returns {Promise<ApiResponse<AlbumPagination>>} The API response with the albums or an error
 */
export const getAlbums = async (
  language_code: LanguageCode,
  revalidate = 3_600
): Promise<ApiResponse<AlbumPagination>> => {
  const { data, error } = await fetchData<AlbumPagination>(
    `${API_BASE_URL}/public/albums?language=${language_code}`,
    {
      next: {
        revalidate: revalidate, // 1 hour or user defined
      },
    }
  )

  if (error) {
    return { data, error }
  }

  return { data, error: null }
}

/**
 * @name getAlbumAndMedia
 * @description Get the album data for a specific language and slug
 *
 * @param {LanguageCode} language_code - The language to get album in
 * @param {string} slug - The slug of the album to get
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 1 day)
 * @returns {Promise<ApiResponse<{ album: Album, media: Media[] }>>} The API response with the album data or an error
 */
export const getAlbumAndMedia = async (
  language_code: LanguageCode,
  slug: string,
  revalidate = 86_400
): Promise<ApiResponse<{ album: Album; media: Media[] }>> => {
  const { data, error } = await fetchData<{
    album: Album
    media: Media[]
  }>(`${API_BASE_URL}/public/albums/${slug}?language=${language_code}`, {
    next: {
      revalidate: revalidate, // 24 hours or user defined
    },
  })

  if (error) {
    return { data, error }
  }

  return { data, error: null }
}

/**
 * @name getLatestMedia
 * @description Get the latest media for a specific language
 *
 * @param {LanguageCode} language_code - The language to get media in
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 1 hour)
 * @returns {Promise<ApiResponse<Media[]>>} The API response with the media or an error
 */
export const getLatestMedia = async (
  language_code: LanguageCode,
  revalidate = 3_600
): Promise<ApiResponse<Media[]>> => {
  const { data, error } = await fetchData<Media[]>(
    `${API_BASE_URL}/public/media/latest?language=${language_code}`,
    {
      next: {
        revalidate: revalidate, // 1 hour or user defined
      },
    }
  )

  if (error) {
    return { data, error }
  }

  return { data, error: null }
}
