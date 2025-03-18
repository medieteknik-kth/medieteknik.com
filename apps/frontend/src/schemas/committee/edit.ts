import { z } from 'zod'

/**
 * @name editCommitteeSchema
 * @description A schema for validating edit committee form data, Used in the following forms:
 *  - src/app/[language]/chapter/committees/[committee]/manage/edit.tsx
 */
export const editCommitteeSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title is required' })
    .max(125, { message: 'Title is too long' }),
  translations: z.array(
    z.object({
      language_code: z.string().optional().or(z.literal('')),
      description: z
        .string()
        .min(1, { message: 'Description is required' })
        .max(511, { message: 'Description is too long' }),
    })
  ),
  logo: z.instanceof(window.File).optional().or(z.literal('')),
  group_photo: z.instanceof(window.File).optional().or(z.literal('')),
})
