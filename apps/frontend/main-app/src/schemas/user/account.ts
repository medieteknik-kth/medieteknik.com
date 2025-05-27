import { z } from 'zod/v4-mini'

/**
 * @name accountSchema
 * @description A schema for validating account form data, Used in the following forms:
 *  - src/app/[language]/account/pages/account/accountForm.tsx
 */
export const accountSchema = z.object({
  profilePicture: z.optional(z.file()),
  currentPassword: z.optional(z.string().check(z.minLength(3))),
  newPassword: z.optional(
    z.string().check(
      z.minLength(8, { error: 'Password must be at least 8 characters' }),
      z.refine(
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
          error:
            'Password must be at least 8 characters, with at least one number, one uppercase character, one lowercase character, and one special character',
        }
      )
    )
  ),
  csrf_token: z.optional(z.string()),
})
