import { z } from 'zod/v4-mini'

/**
 * @name eventUploadSchema
 * @description A schema for validating event data, Used in the following forms:
 *  - src/components/dialogs/EventDialog.tsx
 */
export const eventUploadSchema = z
  .object({
    event_start_date: z.coerce.date().check(
      z.refine((date) => new Date(date) >= new Date(), {
        error: 'Start date must be today or later',
      })
    ),
    event_end_date: z.coerce.date().check(
      z.refine((date) => new Date(date) >= new Date(), {
        error: 'End date must be today or later',
      })
    ),
    repeats: z.optional(z.boolean()),
    frequency: z.optional(z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'])),
    max_occurrences: z.optional(z.coerce.number()),
    location: z
      .string()
      .check(z.minLength(1, { error: 'Location is required' })),
    background_color: z.string().check(
      z.refine(
        (value) => {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
        },
        {
          error: 'Invalid color',
        }
      )
    ),
    translations: z.array(
      z.object({
        language_code: z.optional(z.string()),
        title: z
          .string()
          .check(
            z.minLength(1, { error: 'Title is required' }),
            z.maxLength(255, { error: 'Title is too long' })
          ),
        description: z.optional(
          z
            .string()
            .check(z.maxLength(499, { error: 'Description is too long' }))
        ),
      })
    ),
  })
  .check(
    z.refine(
      (data) =>
        new Date(data.event_end_date) >= new Date(data.event_start_date),
      {
        path: ['event_end_date'],
        message: 'End date must be after start date',
      }
    )
  )
