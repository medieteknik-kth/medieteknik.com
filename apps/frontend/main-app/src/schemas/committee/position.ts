import { z } from 'zod'

/**
 * @name addPositionSchema
 * @description A schema for validating position data, Used in the following forms:
 *  - src/app/[language]/chapter/committees/[committee]/manage/forms/positionForm.tsx
 */
export const addPositionSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email' })
    .optional()
    .or(z.literal('')),
  weight: z.number().or(z.string()).pipe(z.coerce.number()),
  category: z.enum([
    'STYRELSEN',
    'STUDIESOCIALT',
    'NÄRINGSLIV OCH KOMMUNIKATION',
    'UTBILDNING',
    'VALBEREDNINGEN',
    'KÅRFULLMÄKTIGE',
    'REVISORER',
    'FANBORGEN',
    'NONE',
  ]),
  translations: z.array(
    z.object({
      language_code: z.string().optional().or(z.literal('')),
      title: z
        .string()
        .min(3, { message: 'Title is required' })
        .max(125, { message: 'Title is too long' }),
      description: z
        .string()
        .min(1, { message: 'Description is required' })
        .max(500, { message: 'Description is too long' }),
    })
  ),
})

/**
 * @name addPositionSchema
 * @description A schema for validating position data, Used in the following forms:
 *  - src/app/[language]/chapter/committees/[committee]/manage/forms/removePosition.tsx
 */
export const removePositionSchema = z.object({
  position_id: z.string().uuid(),
})
