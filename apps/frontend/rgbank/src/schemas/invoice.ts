import { z } from 'zod'

export const invoiceSchema = z
  .object({
    hasChapterPaid: z.boolean().optional(),
    files: z.array(z.file()).check(
      z.refine((files) => files.length > 0, {
        error: 'At least one file is required',
      })
    ),
    title: z.string().check(
      z.minLength(1, { error: 'Title is required' }),
      z.maxLength(150, {
        error: 'Title must be less than 150 characters',
      })
    ),
    description: z.string().check(
      z.minLength(1, { error: 'Description is required' }),
      z.maxLength(500, {
        error: 'Description must be less than 500 characters',
      })
    ),
    isOriginal: z.boolean().optional(),
    isBooked: z.boolean().optional(),
    date: z.coerce.date(),
    dueDate: z.coerce.date(),
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
          error: 'At least one category is required',
        })
      ),
  })
  .check(
    z.refine((data) => data.dueDate > data.date, {
      error: 'Due date must be after the date',
      path: ['dueDate'],
    })
  )
