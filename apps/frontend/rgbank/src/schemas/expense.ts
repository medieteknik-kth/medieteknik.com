import { z } from 'zod'

export const expenseSchema = z.object({
  files: z.array(z.instanceof(File)).refine((files) => files.length > 0, {
    message: 'At least one file is required',
  }),
  date: z.coerce.date().refine((date) => date <= new Date(), {
    message: 'Date must be in the past',
  }),
  digital: z.boolean(),
  categories: z
    .array(
      z.object({
        id: z.number().optional().or(z.literal('')),
        author: z.string().min(1, { message: 'Author is required' }),
        category: z.string().min(1, { message: 'Category is required' }),
        amount: z.string().min(1, { message: 'Amount is required' }),
      })
    )
    .refine((categories) => categories.length > 0, {
      message: 'At least one category is required',
    }),
})
