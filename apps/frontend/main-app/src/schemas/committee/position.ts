import { z } from 'zod/v4-mini'

/**
 * @name addPositionSchema
 * @description A schema for validating position data, Used in the following forms:
 *  - src/app/[language]/chapter/committees/[committee]/manage/forms/positionForm.tsx
 */
export const addPositionSchema = z.object({
  email: z.optional(z.email({ error: 'Invalid email' })),
  weight: z.coerce.number(),
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
      language_code: z.optional(z.string()),
      title: z
        .string()
        .check(
          z.minLength(3, { error: 'Title is required' }),
          z.maxLength(125, { error: 'Title is too long' })
        ),
      description: z
        .string()
        .check(
          z.minLength(1, { error: 'Description is required' }),
          z.maxLength(500, { error: 'Description is too long' })
        ),
    })
  ),
})

/**
 * @name addPositionSchema
 * @description A schema for validating position data, Used in the following forms:
 *  - src/app/[language]/chapter/committees/[committee]/manage/forms/removePosition.tsx
 */
export const removePositionSchema = z.object({
  committee_position_id: z.uuid(),
})
