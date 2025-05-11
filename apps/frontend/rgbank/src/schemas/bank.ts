import { z } from '@zod/mini'

export const bankSchema = z.object({
  bank_name: z
    .string()
    .check(z.minLength(1, { error: 'Bank name is required' })),
  clearing_number: z.string().check(
    z.minLength(1, { error: 'Clearing number is required' }),
    z.maxLength(15, {
      error: 'Clearing number must be under 15 digits',
    })
  ),
  account_number: z.string().check(
    z.minLength(1, { error: 'Account number is required' }),
    z.maxLength(20, {
      error: 'Account number must be under 20 digits',
    })
  ),
})
