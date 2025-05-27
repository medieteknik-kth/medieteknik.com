import type Committee from '@/models/Committee'
import { z } from 'zod/v4-mini'

export const notificationSchema = (allCommittees: Committee[]) =>
  z
    .object({
      iana: z.string(),
      email: z.optional(z.boolean()),
      push: z.optional(z.boolean()),
      site_updates: z.optional(z.boolean()),
      committees: z.optional(
        z.array(
          z.object({
            committee_id: z.string().check(
              z.refine(
                (value) =>
                  allCommittees.some(
                    (committee) => committee.committee_id === value
                  ),
                {
                  error: 'Invalid committee ID',
                }
              )
            ),
            news: z.optional(z.boolean()),
            event: z.optional(z.boolean()),
          })
        )
      ),
    })
    .check(
      z.refine((form) => {
        // At least one must be true
        if (!form.email && !form.push && !form.committees) return false
        return true
      })
    )
