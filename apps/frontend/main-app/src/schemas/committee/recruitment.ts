import { z } from 'zod/v4-mini'

/**
 * @name createRecruitmentSchema
 * @description A schema for validating recruitment data, Used in the following forms:
 *  - src/app/[language]/chapter/committees/[committee]/manage/forms/recruitmentForm.tsx
 */
export const createRecruitmentSchema = z.object({
  position: z.string(),
  end_date: z.coerce.date().check(
    z.refine((date) => date >= new Date(), {
      error: 'Start date must be today or later',
    })
  ),
  translations: z
    .array(
      z.object({
        language_code: z.optional(z.string()),
        link: z.url().check(z.maxLength(512)),
        description: z.string().check(z.maxLength(200)),
      })
    )
    .check(z.minLength(1)),
})
