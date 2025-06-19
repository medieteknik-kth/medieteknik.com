import { z } from 'zod/v4-mini'
/**
 * @name loginSchema
 * @description A schema for validating login data, Used in the following forms:
 *  - src/app/[language]/login/client/loginForm.tsx
 */
export const loginSchema = z.object({
  email: z.email().check(
    z.minLength(1, { error: 'Please enter your email address' }),
    z.refine((email) => email.includes('@kth.se'), {
      error: 'Please enter a valid student email address (@kth.se)',
    })
  ),
  password: z
    .string()
    .check(
      z.minLength(1, { error: 'Please enter your password' }),
      z.minLength(4, { error: 'Password must be at least 4 characters' }),
      z.maxLength(100, { error: 'Password must be at most 100 characters' })
    ),
  remember: z.optional(z.boolean()),
  csrf_token: z.optional(z.string()),
})
