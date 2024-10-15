import { z } from 'zod';

/**
 * @name documentUploadSchema
 * @description A schema for validating document upload data, Used in the following forms:
 *  - src/components/dialogs/DocumentUpload.tsx
 */
export const documentUploadSchema = z.object({
  type: z.enum(['DOCUMENT', 'FORM']),
  translations: z.array(
    z.object({
      language_code: z.string().optional().or(z.literal('')),
      title: z.string().min(1, { message: 'Required' }),
      file: z.instanceof(window.File),
    })
  ),
})