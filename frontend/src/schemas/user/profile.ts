import { z } from 'zod';

/**
 * @name profileSchema
 * @description A schema for validating profile form data, Used in the following forms:
 *  - src/app/[language]/account/pages/profile/profileForm.tsx
 */
export const profileSchema = z.object({
  facebook: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
})
