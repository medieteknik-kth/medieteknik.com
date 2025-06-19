import { z } from 'zod/v4-mini'

/**
 * @name documentUploadSchema
 * @description A schema for validating document upload data, Used in the following forms:
 *  - src/components/dialogs/DocumentUpload.tsx
 */
export const documentUploadSchema = z.object({
  type: z.enum(['DOCUMENT', 'FORM']),
  translations: z.array(
    z.object({
      language_code: z.optional(z.string()),
      title: z.string().check(z.minLength(1, { error: 'Title is required' })),
      file: z.file(),
    })
  ),
})
