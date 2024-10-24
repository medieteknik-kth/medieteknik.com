import { z } from 'zod'
/**
 * @name loginSchema
 * @description A schema for validating login data, Used in the following forms:
 *  - src/app/[language]/login/client/loginForm.tsx
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email address' })
    .email({ message: 'Please enter a valid email address' })
    .refine(
      (email) => {
        return email.includes('@kth.se')
      },
      {
        message: 'Please enter a valid student email address (@kth.se)',
      }
    ),
  password: z
    .string()
    .min(1, { message: 'Please enter your password' })
    .min(4, { message: 'Password must be at least 8 characters' }),

  csrf_token: z.string().optional().or(z.literal('')),
})
