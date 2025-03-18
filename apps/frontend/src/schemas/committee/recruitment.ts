import { z } from 'zod'

/**
 * @name createRecruitmentSchema
 * @description A schema for validating recruitment data, Used in the following forms:
 *  - src/app/[language]/chapter/committees/[committee]/manage/forms/recruitmentForm.tsx
 */
export const createRecruitmentSchema = z.object({
  position: z.string(),
  end_date: z.coerce.date().refine((date) => date >= new Date(), {
    message: 'Start date must be today or later',
  }),
  translations: z
    .array(
      z.object({
        language_code: z.string().optional().or(z.literal('')),
        link: z.string().url().max(512),
        description: z.string().max(200),
      })
    )
    .min(1),
})
