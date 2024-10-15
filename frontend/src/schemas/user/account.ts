import { z } from 'zod'

/**
 * @name accountSchema
 * @description A schema for validating account form data, Used in the following forms:
 *  - src/app/[language]/account/pages/account/accountForm.tsx
 */
export const accountSchema = z.object({
  profilePicture: z.instanceof(window.File).optional().or(z.literal('')),
  emailTwo: z.string().email().optional().or(z.literal('')),
  emailThree: z.string().email().optional().or(z.literal('')),
  currentPassword: z.string().min(3).optional().or(z.literal('')),
  newPassword: z
    .string()
    .min(8)
    .optional()
    .or(z.literal(''))
    .refine(
      (value) => {
        if (!value) return true
        // At least one number
        if (!/[0-9]/.test(value)) return false
        // At least one lowercase character
        if (!/[a-z]/.test(value)) return false
        // At least one uppercase character
        if (!/[A-Z]/.test(value)) return false
        // At least one special character
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) return false
        return true
      },
      {
        message:
          'Password must be at least 8 characters, with at least one number, one uppercase character, one lowercase character, and one special character',
      }
    ),
  csrf_token: z.string().optional().or(z.literal('')),
})