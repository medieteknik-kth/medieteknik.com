import { z } from 'zod'

export const expenseSchema = z.object({
  files: z.array(z.file()).check(
    z.refine((files) => files.length > 0, {
      error: 'At least one file is required',
    })
  ),
  date: z.coerce.date().check(
    z.refine((date) => date <= new Date(), {
      error: 'Date must be in the past',
    })
  ),
  title: z
    .string()
    .check(z.minLength(1, { error: 'Title is required' }))
    .check(z.maxLength(150, { error: 'Title must be under 150 characters' })),

  description: z
    .string()
    .check(
      z.minLength(1, { error: 'Description is required' }),
      z.maxLength(500, { error: 'Description must be under 500 characters' })
    ),
  digital: z.boolean(),
  categories: z
    .array(
      z.object({
        id: z.number().optional().or(z.literal('')),
        author: z
          .string()
          .check(z.minLength(1, { error: 'Author is required' })),
        category: z
          .string()
          .check(z.minLength(1, { error: 'Category is required' })),
        amount: z
          .string()
          .check(z.minLength(1, { error: 'Amount is required' })),
      })
    )
    .check(
      z.refine((categories) => categories.length > 0, {
        message: 'At least one category is required',
      })
    ),
})
