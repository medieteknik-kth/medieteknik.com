import { z } from 'zod/v4-mini'

/**
 * @name mediaUploadSchema
 * @description A schema for validating media upload data, Used in the following forms:
 *  - src/components/dialogs/MediaUpload.tsx
 */
export const mediaUploadSchema = z
  .object({
    media_type: z.enum(['image', 'video']),
    media: z.optional(z.file()),
    youtube_url: z.optional(z.url()).check(
      z.refine((url) => {
        if (!url) return true
        try {
          const parsedUrl = new URL(url)
          const allowedHosts = ['youtube.com', 'www.youtube.com', 'youtu.be']
          return allowedHosts.includes(parsedUrl.host)
        } catch (e) {
          return false
        }
      })
    ),
    translations: z.array(
      z.object({
        language_code: z.optional(z.string()),
        title: z
          .string()
          .check(
            z.minLength(1, { error: 'Title is required' }),
            z.maxLength(100, { error: 'Max 100 characters' })
          ),
        description: z.optional(
          z.string().check(z.maxLength(254, { error: 'Max 255 characters' }))
        ),
      })
    ),
  })
  .check(
    z.refine((data) => {
      if (data.media_type === 'video') {
        return data.youtube_url !== ''
      }
      return data.media !== ''
    })
  )
