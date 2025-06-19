import { z } from 'zod/v4-mini'

export const albumUploadSchema = z.object({
  translations: z.array(
    z.object({
      language_code: z.optional(z.string()),
      title: z
        .string()
        .check(
          z.minLength(1, { error: 'Required' }),
          z.maxLength(255, { error: 'Max 100 characters' })
        ),
      description: z.optional(
        z
          .string()
          .check(
            z.minLength(1, { error: 'Required' }),
            z.maxLength(511, { error: 'Max 500 characters' })
          )
      ),
    })
  ),
})
