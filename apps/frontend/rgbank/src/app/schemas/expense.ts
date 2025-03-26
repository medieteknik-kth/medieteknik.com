import { z } from 'zod'

export const expenseSchema = z.object({
  image: z.instanceof(window.File),
  description: z.string().min(1, { message: 'Description is required' }),
  date: z.coerce.date().refine((date) => date <= new Date(), {
    message: 'Date must be in the past',
  }),
  amount: z.coerce.number().min(0, { message: 'Amount must be positive' }),
  currency: z.enum(['USD', 'EUR', 'GBP'], {
    errorMap: () => ({ message: 'Currency is required' }),
  }),
  digital: z.boolean().optional(),
  category: z
    .array(
      z.object({
        author: z.string().min(1, { message: 'Author is required' }),
        category: z.string().min(1, { message: 'Category is required' }),
        type: z.string().min(1, { message: 'Type is required' }),
        amount: z.coerce
          .number()
          .min(0, { message: 'Amount must be positive' }),
      })
    )
    .refine((categories) => categories.length > 0, {
      message: 'At least one category is required',
    }),
})
