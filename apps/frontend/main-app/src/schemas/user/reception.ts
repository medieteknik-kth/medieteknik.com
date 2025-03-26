import { z } from 'zod'

/**
 * @name receptionSchema
 * @description A schema for validating reception form data, Used in the following forms:
 *  - src/app/[language]/reception/pages/reception/receptionForm.tsx
 */
export const receptionSchema = z.object({
  image: z.instanceof(window.File).optional().or(z.literal('')),
  receptionName: z.string().optional().or(z.literal('')),
  csrf_token: z.string().optional().or(z.literal('')),
})
