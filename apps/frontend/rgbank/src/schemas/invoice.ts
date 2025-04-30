import { z } from 'zod'

export const invoiceSchema = z
  .object({
    hasChapterPaid: z.boolean().optional(),
    files: z.array(z.instanceof(File)).refine((files) => files.length > 0, {
      message: 'At least one file is required',
    }),
    title: z.string().min(1, { message: 'Title is required' }).max(150, {
      message: 'Title must be less than 150 characters',
    }),
    description: z.string().min(1, { message: 'Description is required' }),
    isOriginal: z.boolean().optional(),
    isBooked: z.boolean().optional(),
    date: z.coerce.date(),
    dueDate: z.coerce.date(),
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
  .refine((data) => data.dueDate > data.date, {
    message: 'Due date must be after the date',
    path: ['dueDate'],
  })
