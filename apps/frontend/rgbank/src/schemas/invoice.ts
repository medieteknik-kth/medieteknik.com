import { z } from 'zod'

export const invoiceSchema = z.object({
  hasChapterPaid: z.boolean().optional(),
  files: z.array(z.instanceof(File)).refine((files) => files.length > 0, {
    message: 'At least one file is required',
  }),
  description: z.string().min(1, { message: 'Description is required' }),
  isOriginal: z.boolean().optional(),
  isBooked: z.boolean().optional(),
  date: z.coerce.date().refine((date) => date <= new Date(), {
    message: 'Date must be in the past',
  }),
  dueDate: z.coerce.date().refine((date) => date > new Date(), {
    message: 'Due date must be in the future',
  }),
  categories: z
    .array(
      z.object({
        id: z.string().optional().or(z.literal('')),
        author: z.string().min(1, { message: 'Author is required' }),
        category: z.string().min(1, { message: 'Category is required' }),
        type: z.string().min(1, { message: 'Type is required' }),
        amount: z.string().min(1, { message: 'Amount is required' }),
      })
    )
    .refine((categories) => categories.length > 0, {
      message: 'At least one category is required',
    }),
})
