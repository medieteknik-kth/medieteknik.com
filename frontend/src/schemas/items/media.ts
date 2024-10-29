import { z } from 'zod'

/**
 * @name mediaUploadSchema
 * @description A schema for validating media upload data, Used in the following forms:
 *  - src/components/dialogs/MediaUpload.tsx
 */
export const mediaUploadSchema = z
  .object({
    media_type: z.enum(['image', 'video']),
    media: z.instanceof(window.File).optional().or(z.literal('')),
    youtube_url: z
      .string()
      .url()
      .optional()
      .or(z.literal(''))
      .refine((url) => {
        if (!url) return true
        return url.includes('youtube.com') || url.includes('youtu.be')
      }),
    translations: z.array(
      z.object({
        language_code: z.string().optional().or(z.literal('')),
        title: z
          .string()
          .min(1, { message: 'Required' })
          .max(100, { message: 'Max 100 characters' }),
        description: z
          .string()
          .max(254, { message: 'Max 255 characters' })
          .optional()
          .or(z.literal('')),
      })
    ),
  })
  .refine((data) => {
    if (data.media_type === 'video') {
      return data.youtube_url !== ''
    } else if (data.media_type === 'image') {
      return data.media !== ''
    }
    return false
  })
