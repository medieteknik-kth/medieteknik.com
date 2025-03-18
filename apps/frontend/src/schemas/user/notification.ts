import type Committee from '@/models/Committee'
import { z } from 'zod'

export const notificationSchema = (allCommittees: Committee[]) =>
  z
    .object({
      iana: z.string(),
      email: z.boolean().optional().or(z.literal(false)),
      push: z.boolean().optional().or(z.literal(false)),
      site_updates: z.boolean().optional().or(z.literal(false)),
      committees: z
        .array(
          z.object({
            committee_id: z
              .string()
              .refine(
                (value) =>
                  allCommittees.some(
                    (committee) => committee.committee_id === value
                  ),
                {
                  message: 'Invalid committee ID',
                }
              ),
            news: z.boolean().optional().or(z.literal(false)),
            event: z.boolean().optional().or(z.literal(false)),
          })
        )
        .optional(),
    })
    .refine((form) => {
      // At least one must be true
      if (!form.email && !form.push && !form.committees) return false
      return true
    })
