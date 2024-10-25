import { z } from 'zod'

export const albumUploadSchema = z.object({
  translations: z.array(
    z.object({
      language_code: z.string().optional().or(z.literal('')),
      title: z
        .string()
        .min(1, { message: 'Required' })
        .max(255, { message: 'Max 100 characters' }),
      description: z
        .string()
        .min(1, { message: 'Required' })
        .max(511, { message: 'Max 500 characters' })
        .optional()
        .or(z.literal('')),
    })
  ),
})
