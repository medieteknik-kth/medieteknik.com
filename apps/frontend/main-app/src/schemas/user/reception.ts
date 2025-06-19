import { z } from 'zod/v4-mini'

/**
 * @name receptionSchema
 * @description A schema for validating reception form data, Used in the following forms:
 *  - src/app/[language]/reception/pages/reception/receptionForm.tsx
 */
export const receptionSchema = z.object({
  image: z.optional(z.file()),
  receptionName: z.optional(z.string()),
  csrf_token: z.optional(z.string()),
})
