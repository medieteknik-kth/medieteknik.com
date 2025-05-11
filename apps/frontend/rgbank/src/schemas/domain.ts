import { z } from '@zod/mini'

export const domainSchema = z
  .object({
    title: z.optional(
      z.string().check(
        z.minLength(1, { error: 'Domain title is required' }),
        z.maxLength(100, {
          error: 'Domain title must be under 100 characters',
        })
      )
    ),
    parts: z.optional(
      z.array(z.string().check(z.minLength(1, { error: 'Part is required' })))
    ),
  })
  .check(
    z.refine(
      (data) => (data.title || '') === '' && (data.parts || []).length > 0,
      {
        error: 'At least one field must be filled',
      }
    )
  )
