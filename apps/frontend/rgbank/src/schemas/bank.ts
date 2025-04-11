import { z } from 'zod'

export const bankSchema = z.object({
  bank_name: z.string().min(1, { message: 'Bank name is required' }),
  clearing_number: z
    .string()
    .min(1, { message: 'Clearing number is required' })
    .max(15, {
      message: 'Clearing number must be under 15 digits',
    }),
  account_number: z
    .string()
    .min(1, { message: 'Account number is required' })
    .max(20, {
      message: 'Account number must be under 20 digits',
    }),
})
