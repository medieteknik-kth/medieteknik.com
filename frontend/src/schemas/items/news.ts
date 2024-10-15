import { z } from 'zod';


/**
 * @name createNewsSchema
 * @description A schema for validating news upload data, Used in the following forms:
 * - src/components/dialogs/NewsUpload.tsx
 */
export const createNewsSchema = z.object({
  title: z.string().optional().or(z.literal('')),
  image: z.instanceof(window.File).optional().or(z.any()),
})

/**
 * @name uploadNewsSchema
 * @description A schema for validating news upload data, Used in the following forms:
 *  - src/app/[language]/bulletin/news/upload/[slug]/commandBar.tsx
 */
export const uploadNewsSchema = z.object({
  title: z.string(),
  image: z.instanceof(window.File).optional().or(z.any()),
  short_description: z.string().max(120, { message: 'Too long' }),
})