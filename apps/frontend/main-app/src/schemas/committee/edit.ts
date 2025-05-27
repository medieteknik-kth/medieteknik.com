import { z } from 'zod/v4-mini'

/**
 * @name editCommitteeSchema
 * @description A schema for validating edit committee form data, Used in the following forms:
 *  - src/app/[language]/chapter/committees/[committee]/manage/edit.tsx
 */
export const editCommitteeSchema = z.object({
  title: z
    .string()
    .check(
      z.minLength(3, { error: 'Title is required' }),
      z.maxLength(125, { error: 'Title is too long' })
    ),
  translations: z.array(
    z.object({
      language_code: z.optional(z.string()),
      description: z
        .string()
        .check(
          z.minLength(1, { error: 'Description is required' }),
          z.maxLength(511, { error: 'Description is too long' })
        ),
    })
  ),
  logo: z.optional(z.file()),
  group_photo: z.optional(z.file()),
})
