import { z } from 'zod'

/**
 * @name addMember
 * @description A schema for validating add member form data, Used in the following forms:
 *  - src/app/[language]/chapter/committees/[committee]/manage/forms/memberForm.tsx
 */
export const addMember = z.object({
  students: z
    .array(
      z.object({
        student_email: z.string().email(),
      })
    )
    .min(1),
})
