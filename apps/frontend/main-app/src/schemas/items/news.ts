'use client'

import { z } from 'zod/v4-mini'

/**
 * @name createNewsSchema
 * @description A schema for validating news upload data, Used in the following forms:
 * - src/components/dialogs/NewsUpload.tsx
 */
export const createNewsSchema = z.object({
  title: z.optional(z.string()),
})

/**
 * @name uploadNewsSchema
 * @description A schema for validating news upload data, Used in the following forms:
 *  - src/app/[language]/bulletin/news/upload/[slug]/commandBar.tsx
 */
export const uploadNewsSchema = z.object({
  title: z.string(),
  image: z.optional(z.file()),
  short_description: z.string().check(z.maxLength(120, { error: 'Too long' })),
})
