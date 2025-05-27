import { z } from 'zod/v4-mini'

/**
 * @name addMember
 * @description A schema for validating add member form data, Used in the following forms:
 *  - src/app/[language]/chapter/committees/[committee]/manage/forms/memberForm.tsx
 */
export const addMember = z.object({
  students: z
    .array(
      z.object({
        student_email: z.email(),
      })
    )
    .check(z.minLength(1, { error: 'At least one member must be selected' })),
  committee_position_id: z.uuid(),
})

export const removeMember = z.object({
  students: z
    .array(
      z.object({
        student_email: z.email(),
      })
    )
    .check(z.minLength(1, { error: 'At least one member must be selected' })),
  committee_position_id: z.uuid(),
})
