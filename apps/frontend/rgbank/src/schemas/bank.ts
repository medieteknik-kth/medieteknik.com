import { z } from 'zod'

export const bankSchema = z.object({
  bank_name: z.string().min(1, { message: 'Bank name is required' }),
  sorting_number: z
    .string()
    .min(1, { message: 'Sorting number is required' })
    .max(6, {
      message: 'Sorting number must be under 6 digits',
    }),
  account_number: z
    .string()
    .min(1, { message: 'Account number is required' })
    .max(13, {
      message: 'Account number must be under 13 digits',
    }),
})
