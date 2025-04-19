import { z } from 'zod'

export const domainSchema = z
  .object({
    title: z
      .string()
      .min(1, { message: 'Domain title is required' })
      .optional()
      .or(z.literal('')),
    parts: z
      .array(z.string().min(1, { message: 'Domain part is required' }))
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => (data.title || '') === '' && (data.parts || []).length > 0,
    {
      message: 'At least one field must be filled',
    }
  )
