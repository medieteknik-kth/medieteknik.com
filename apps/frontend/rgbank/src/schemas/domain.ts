import { z } from 'zod'

export const domainSchema = z
  .object({
    title: z
      .string()
      .check(
        z.minLength(1, { message: 'Domain title is required' }),
        z.maxLength(100, {
          message: 'Domain title must be under 100 characters',
        })
      )
      .optional()
      .or(z.literal('')),
    parts: z
      .array(z.string().check(z.minLength(1, { message: 'Part is required' })))
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => (data.title || '') === '' && (data.parts || []).length > 0,
    {
      message: 'At least one field must be filled',
    }
  )
