import { z } from 'zod'

/**
 * @name eventUploadSchema
 * @description A schema for validating event data, Used in the following forms:
 *  - src/components/dialogs/EventDialog.tsx
 */
export const eventUploadSchema = z.object({
  date: z.string().date(),
  start_time: z.string().time(),
  duration: z.coerce.number().int().min(1, 'Duration is required'),
  repeats: z.boolean().optional().or(z.literal(false)),
  frequency: z
    .enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'])
    .optional()
    .or(z.literal('')),
  end_date: z.string().date().optional().or(z.literal('')),
  max_occurrences: z.coerce.number().optional().or(z.literal(0)),
  location: z.string().min(1, 'Location is required'),
  background_color: z.string().refine(
    (value) => {
      return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
    },
    {
      message: 'Invalid color',
    }
  ),
  translations: z.array(
    z.object({
      language_code: z.string().optional().or(z.literal('')),
      title: z
        .string()
        .min(1, 'Title is required')
        .max(255, 'Title is too long'),
      description: z
        .string()
        .max(499, 'Description is too long')
        .optional()
        .or(z.literal('')),
    })
  ),
})