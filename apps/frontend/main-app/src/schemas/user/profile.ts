import { z } from 'zod/v4-mini'

/**
 * @name profileSchema
 * @description A schema for validating profile form data, Used in the following forms:
 *  - src/app/[language]/account/pages/profile/profileForm.tsx
 */
export const profileSchema = z.object({
  facebook: z.optional(z.url()),
  instagram: z.optional(z.url()),
  linkedin: z.optional(z.url()),
})
